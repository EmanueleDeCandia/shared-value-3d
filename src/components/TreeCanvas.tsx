import { useEffect, useRef, useState } from "react";
import { store, useStoreVersion, type NodeSel, type NodeType } from "../lib/store";
import {
  buildScene,
  pointOnPath,
  type Scene,
  type Vec,
} from "../lib/tree";
import {
  INPUTS,
  INPUT_BY_KEY,
  METRICS,
  METRIC_BY_ID,
  BRANCHES,
  TRUNK_COPY,
  LEAVES_COPY,
  type InputKey,
} from "../lib/model";
import { formatValue, fmtInt } from "../lib/format";

interface Hit {
  x: number;
  y: number;
  r: number;
  d: number;
  type: NodeType;
  id: string;
}

interface Sap {
  kind: 0 | 1 | 2 | 3; // radice-su, tronco-su, tronco-giu, ramo
  pts: Vec[] | null;
  branch: number;
  t: number;
  speed: number;
  phase: number;
}

const TAU = Math.PI * 2;

function inputDisplay(key: InputKey): string {
  const def = INPUT_BY_KEY[key];
  const v = store.inputs[key];
  if (def.unit === "%") return `${fmtInt(v)}%`;
  if (def.unit === "€" || def.unit === "€/anno") return `€ ${fmtInt(v)}`;
  return `${fmtInt(v)} ${def.unit}`;
}

function nodeTooltip(sel: { type: NodeType; id: string }): { label: string; value: string } {
  switch (sel.type) {
    case "root": {
      const def = INPUT_BY_KEY[sel.id as InputKey];
      return { label: def.label, value: inputDisplay(sel.id as InputKey) };
    }
    case "trunk":
      return { label: TRUNK_COPY.title, value: "canale a doppia linfa" };
    case "branch": {
      const b = BRANCHES[Number(sel.id)];
      return { label: b.title, value: `meccanica ${Number(sel.id) + 1} di 5` };
    }
    case "leaves": {
      const ad = store.getModel().adozioneMedia;
      return { label: LEAVES_COPY.title, value: `adozione media ${fmtInt(ad * 100)}%` };
    }
    case "fruit": {
      const m = METRIC_BY_ID[sel.id];
      const v = store.getModel().values[m.id] ?? 0;
      return { label: m.label, value: formatValue(m.fmt, v) };
    }
  }
}

function computeHighlight(sel: { type: NodeType; id: string } | null) {
  const segNodes = new Set<string>();
  const fruitIds = new Set<string>();
  let leaves = false;
  if (!sel) return { segNodes, fruitIds, leaves };
  if (sel.type === "root") {
    segNodes.add(`root:${sel.id}`);
    METRICS.forEach((m) => {
      if (m.roots.includes(sel.id as InputKey)) fruitIds.add(m.id);
    });
  } else if (sel.type === "trunk") {
    segNodes.add("trunk");
  } else if (sel.type === "branch") {
    const b = Number(sel.id);
    segNodes.add(`branch:${b}`);
    segNodes.add("trunk");
    METRICS.forEach((m) => {
      if (m.branch === b) {
        fruitIds.add(m.id);
        m.roots.forEach((r) => segNodes.add(`root:${r}`));
      }
    });
  } else if (sel.type === "leaves") {
    leaves = true;
  } else if (sel.type === "fruit") {
    const m = METRIC_BY_ID[sel.id];
    if (m) {
      segNodes.add(`fruit:${m.id}`);
      segNodes.add(`branch:${m.branch}`);
      segNodes.add("trunk");
      m.roots.forEach((r) => segNodes.add(`root:${r}`));
      fruitIds.add(m.id);
    }
  }
  return { segNodes, fruitIds, leaves };
}

export default function TreeCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tipLabelRef = useRef<HTMLSpanElement>(null);
  const tipValueRef = useRef<HTMLSpanElement>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const version = useStoreVersion();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let disposed = false;

    /* ---------- camera ---------- */
    const T = { x: 0, y: 2.7, z: 0 };
    let theta = 0.72;
    let phi = 0.3;
    let radius = 21.5;
    let velT = 0;
    let velP = 0;
    let lastInteract = 0;
    let dragging = false;
    let downX = 0;
    let downY = 0;
    let moved = false;
    let lastPX = 0;
    let lastPY = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchD = 0;

    /* ---------- viewport ---------- */
    let w = 10;
    let h = 10;
    let dpr = 1;
    function resize() {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    /* ---------- scena ---------- */
    let scene: Scene | null = null;
    let sceneVersion = -1;
    let sap: Sap[] = [];
    let segBuf = new Float32Array(0);
    let segDepth = new Float32Array(0);
    let leafBuf = new Float32Array(0);
    let leafDepth = new Float32Array(0);
    let fruitBuf = new Float32Array(0);
    let fruitDepth = new Float32Array(0);

    /* polveri ambientali */
    const motes: { x: number; y: number; z: number; ph: number; sp: number; warm: boolean }[] = [];
    {
      let s = 99;
      const r = () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
      for (let i = 0; i < 26; i++) {
        motes.push({
          x: (r() - 0.5) * 26,
          y: 0.6 + r() * 9.5,
          z: (r() - 0.5) * 26,
          ph: r() * TAU,
          sp: 0.15 + r() * 0.4,
          warm: r() > 0.5,
        });
      }
    }

    /* draw list pool */
    let dlCap = 0;
    let dlD = new Float64Array(0);
    let dlK = new Uint8Array(0);
    let dlI = new Int32Array(0);
    let dlCount = 0;
    const order: number[] = [];
    function dlPush(d: number, k: number, i: number) {
      if (dlCount === dlCap) {
        dlCap = dlCap === 0 ? 2048 : dlCap * 2;
        const nd = new Float64Array(dlCap);
        const nk = new Uint8Array(dlCap);
        const ni = new Int32Array(dlCap);
        nd.set(dlD.subarray(0, dlCount));
        nk.set(dlK.subarray(0, dlCount));
        ni.set(dlI.subarray(0, dlCount));
        dlD = nd;
        dlK = nk;
        dlI = ni;
      }
      dlD[dlCount] = d;
      dlK[dlCount] = k;
      dlI[dlCount] = i;
      dlCount++;
    }

    /* hit pool */
    const hits: Hit[] = [];
    let hitCount = 0;
    function pushHit(x: number, y: number, r: number, d: number, type: NodeType, id: string) {
      if (hitCount < hits.length) {
        const hp = hits[hitCount];
        hp.x = x;
        hp.y = y;
        hp.r = r;
        hp.d = d;
        hp.type = type;
        hp.id = id;
      } else {
        hits.push({ x, y, r, d, type, id });
      }
      hitCount++;
    }

    let hover: { type: NodeType; id: string } | null = null;

    function rebuild() {
      scene = buildScene(store.inputs, store.getModel());
      sceneVersion = store.version;
      const s = scene;
      segBuf = new Float32Array(s.segs.length * 6);
      segDepth = new Float32Array(s.segs.length);
      leafBuf = new Float32Array(s.leaves.length * 4);
      leafDepth = new Float32Array(s.leaves.length);
      fruitBuf = new Float32Array(s.fruits.length * 3);
      fruitDepth = new Float32Array(s.fruits.length);

      sap = [];
      let si = 7;
      const rnd = () => {
        si = (si * 16807) % 2147483647;
        return si / 2147483647;
      };
      s.rootPaths.forEach((rp) => {
        const n = 2 + Math.floor(rp.flow * 2.5);
        for (let i = 0; i < n; i++) {
          sap.push({ kind: 0, pts: rp.pts, branch: -1, t: rnd(), speed: 0.16 + 0.2 * rp.flow, phase: rnd() * TAU });
        }
      });
      for (let i = 0; i < 7; i++) sap.push({ kind: 1, pts: null, branch: -1, t: i / 7, speed: 0.22, phase: rnd() * TAU });
      for (let i = 0; i < 5; i++) sap.push({ kind: 2, pts: null, branch: -1, t: i / 5, speed: 0.15, phase: rnd() * TAU });
      s.branchPaths.forEach((_, b) => {
        for (let i = 0; i < 2; i++)
          sap.push({ kind: 3, pts: null, branch: b, t: rnd(), speed: 0.3, phase: rnd() * TAU });
      });
    }

    /* ---------- proiezione ---------- */
    const pv = { x: 0, y: 0, s: 0, d: 0, ok: false };
    let cosT = 1;
    let sinT = 0;
    let cosP = 1;
    let sinP = 0;
    let focal = 800;
    let cx = 0;
    let cy = 0;
    function project(x: number, y: number, z: number) {
      const dx = x - T.x;
      const dy = y - T.y;
      const dz = z - T.z;
      const x1 = dx * cosT + dz * sinT;
      const z1 = -dx * sinT + dz * cosT;
      const y2 = dy * cosP + z1 * sinP;
      const z2 = -dy * sinP + z1 * cosP;
      const d = z2 + radius;
      if (d < 0.6) {
        pv.ok = false;
        return;
      }
      const s = focal / d;
      pv.x = cx + x1 * s;
      pv.y = cy - y2 * s;
      pv.s = s;
      pv.d = d;
      pv.ok = true;
    }

    /* ---------- vento ---------- */
    function windX(x: number, y: number, z: number, t: number, amp: number): number {
      if (y < 4.0) return 0;
      const f = Math.min(1, (y - 4.0) / 6.0);
      const a = amp * f * f;
      return (Math.sin(t * 1.25 + x * 0.6 + z * 0.3) * 0.65 + Math.sin(t * 2.6 + z) * 0.35) * a;
    }

    /* ---------- rendering ---------- */
    function frame(nowMs: number) {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      const now = nowMs / 1000;

      if (!scene || store.version !== sceneVersion) rebuild();
      const s = scene!;

      /* camera dinamica */
      if (!dragging) {
        theta += velT;
        phi += velP;
        velT *= 0.92;
        velP *= 0.92;
        if (nowMs - lastInteract > 3200) theta += 0.0017;
      }
      phi = Math.max(0.07, Math.min(1.22, phi));

      cosT = Math.cos(theta);
      sinT = Math.sin(theta);
      cosP = Math.cos(phi);
      sinP = Math.sin(phi);
      focal = h * 1.06;

      // Spostamento esplicito dell'albero:
      // A destra di almeno 20-35mm (~140px su desktop) per liberare la colonna testo a sinistra
      // In basso di almeno 20-25mm (~95px) per non soffocare la chioma sotto la barra superiore
      const mmToPx = 96 / 25.4;
      const shiftX = w >= 768 ? Math.round(Math.max(140, 25 * mmToPx)) : Math.round(Math.min(20 * mmToPx, w * 0.1));
      const shiftY = Math.round(Math.max(95, 22 * mmToPx));

      cx = w / 2 + shiftX;
      cy = h / 2 + h * 0.02 + shiftY;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* --- sfondo: cielo e suolo (sezione del terreno) --- */
      project(0, 0, 0);
      const baseSy = pv.ok ? pv.y : h * 0.62;
      const horizonY = baseSy - (T.y - 0) * 0; // punto base a terra
      void horizonY;
      project(Math.cos(theta + Math.PI / 2) * 900, 0, Math.sin(theta + Math.PI / 2) * 900);
      const hL = pv.ok ? pv.y : baseSy;
      project(-Math.cos(theta + Math.PI / 2) * 900, 0, -Math.sin(theta + Math.PI / 2) * 900);
      const hR = pv.ok ? pv.y : baseSy;

      const sky = ctx.createLinearGradient(0, 0, 0, Math.max(hL, hR));
      sky.addColorStop(0, "#0b120e");
      sky.addColorStop(0.7, "#101c15");
      sky.addColorStop(1, "#16241b");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const soilTop = Math.min(hL, hR);
      const soil = ctx.createLinearGradient(0, soilTop, 0, h);
      soil.addColorStop(0, "#241709");
      soil.addColorStop(0.25, "#1a1007");
      soil.addColorStop(1, "#0a0603");
      ctx.fillStyle = soil;
      ctx.beginPath();
      project(Math.cos(theta + Math.PI / 2) * 900, 0, Math.sin(theta + Math.PI / 2) * 900);
      const ax = pv.x;
      const ay = pv.y;
      project(-Math.cos(theta + Math.PI / 2) * 900, 0, -Math.sin(theta + Math.PI / 2) * 900);
      ctx.moveTo(ax, ay);
      ctx.lineTo(pv.x, pv.y);
      ctx.lineTo(w + 220, h + 220);
      ctx.lineTo(-220, h + 220);
      ctx.closePath();
      ctx.fill();

      /* strati del sottosuolo */
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        const yy = soilTop + ((h - soilTop) * i) / 6;
        ctx.strokeStyle = `rgba(70, 46, 20, ${0.32 - i * 0.05})`;
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 14) {
          const yw = yy + Math.sin(x * 0.013 + i * 2.2) * 5 + Math.sin(x * 0.031 + i) * 2.5;
          if (x === -10) ctx.moveTo(x, yw);
          else ctx.lineTo(x, yw);
        }
        ctx.stroke();
      }

      /* alone nutritivo sotterraneo */
      project(0, -2.4, 0);
      if (pv.ok) {
        const g = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, 4.6 * pv.s);
        g.addColorStop(0, "rgba(232,181,74,0.10)");
        g.addColorStop(1, "rgba(232,181,74,0)");
        ctx.fillStyle = g;
        ctx.fillRect(pv.x - 4.6 * pv.s, pv.y - 4.6 * pv.s, 9.2 * pv.s, 9.2 * pv.s);
      }

      /* tumulo alla base */
      project(0, 0.02, 0);
      if (pv.ok) {
        ctx.fillStyle = "#1d1207";
        ctx.beginPath();
        ctx.ellipse(pv.x, pv.y, 1.9 * pv.s, 0.62 * pv.s, 0, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "rgba(90,120,70,0.16)";
        ctx.beginPath();
        ctx.ellipse(pv.x, pv.y - 0.05 * pv.s, 1.9 * pv.s, 0.6 * pv.s, 0, Math.PI, TAU);
        ctx.fill();
      }

      /* pulviscolo */
      for (const m of motes) {
        const mx = m.x + Math.sin(now * m.sp + m.ph) * 0.9;
        const my = m.y + Math.sin(now * m.sp * 0.8 + m.ph * 2) * 0.5;
        project(mx, my, m.z);
        if (!pv.ok) continue;
        ctx.fillStyle = m.warm ? "rgba(232,181,74,0.20)" : "rgba(196,224,138,0.16)";
        ctx.beginPath();
        ctx.arc(pv.x, pv.y, Math.max(0.8, 1.7 * (pv.s / 40)), 0, TAU);
        ctx.fill();
      }

      /* --- proiezione geometria --- */
      dlCount = 0;
      hitCount = 0;
      const density = Math.min(1.12, 0.5 + store.getModel().adozioneMedia * 1.15);

      const segs = s.segs;
      for (let i = 0; i < segs.length; i++) {
        const g = segs[i];
        const wax = windX(g.ax, g.ay, g.az, now, 0.085);
        const wbx = windX(g.bx, g.by, g.bz, now, 0.085);
        project(g.ax + wax, g.ay, g.az + wax * 0.4);
        if (!pv.ok) continue;
        const ax2 = pv.x;
        const ay2 = pv.y;
        const sa = pv.s;
        const da = pv.d;
        project(g.bx + wbx, g.by, g.bz + wbx * 0.4);
        if (!pv.ok) continue;
        const o = i * 6;
        segBuf[o] = ax2;
        segBuf[o + 1] = ay2;
        segBuf[o + 2] = pv.x;
        segBuf[o + 3] = pv.y;
        segBuf[o + 4] = sa;
        segBuf[o + 5] = pv.s;
        segDepth[i] = (da + pv.d) / 2;
        dlPush(segDepth[i], 0, i);
      }

      const leaves = s.leaves;
      for (let i = 0; i < leaves.length; i++) {
        const lf = leaves[i];
        if (lf.rand > density) continue;
        const wx = windX(lf.x, lf.y, lf.z, now, 0.24) + Math.sin(now * 2.1 + lf.phase) * 0.045;
        project(lf.x + wx, lf.y + Math.sin(now * 1.4 + lf.phase) * 0.03, lf.z + wx * 0.35);
        if (!pv.ok) continue;
        const o = i * 4;
        leafBuf[o] = pv.x;
        leafBuf[o + 1] = pv.y;
        leafBuf[o + 2] = lf.size * pv.s;
        leafBuf[o + 3] = Math.sin(now * 1.1 + lf.phase) * 0.5 + lf.phase;
        leafDepth[i] = pv.d;
        dlPush(pv.d, 1, i);
      }

      const fruits = s.fruits;
      for (let i = 0; i < fruits.length; i++) {
        const fr = fruits[i];
        const bob = Math.sin(now * 1.15 + fr.phase) * 0.04;
        project(fr.x, fr.y + bob, fr.z);
        if (!pv.ok) continue;
        const pulse = 1 + 0.055 * Math.sin(now * 2.2 + fr.phase);
        const o = i * 3;
        fruitBuf[o] = pv.x;
        fruitBuf[o + 1] = pv.y;
        fruitBuf[o + 2] = fr.r * pv.s * pulse;
        fruitDepth[i] = pv.d;
        dlPush(pv.d, 2, i);
        pushHit(pv.x, pv.y, fruitBuf[o + 2] + 7, pv.d, "fruit", fr.metricId);
      }

      /* hit invisibili: tronco, radici, rami, chioma */
      for (let i = 0; i < s.trunkPath.length; i += 2) {
        const p = s.trunkPath[i];
        project(p.x, p.y, p.z);
        if (pv.ok) pushHit(pv.x, pv.y, s.trunkW * pv.s + 7, pv.d, "trunk", "trunk");
      }
      s.rootPaths.forEach((rp) => {
        for (let i = 1; i < rp.pts.length; i += 3) {
          const p = rp.pts[i];
          project(p.x, p.y, p.z);
          if (pv.ok) pushHit(pv.x, pv.y, 11, pv.d, "root", rp.id);
        }
      });
      s.branchPaths.forEach((bp, b) => {
        for (let i = 2; i < bp.length; i += 2) {
          project(bp[i].x, bp[i].y, bp[i].z);
          if (pv.ok) pushHit(pv.x, pv.y, 10, pv.d, "branch", String(b));
        }
      });
      s.branchTips.forEach((tp) => {
        project(tp.x, tp.y, tp.z);
        if (pv.ok) pushHit(pv.x, pv.y, 9, pv.d, "branch", String(tp.b));
      });
      s.clusters.forEach((c) => {
        project(c.x, c.y, c.z);
        if (pv.ok) pushHit(pv.x, pv.y, Math.max(13, c.r * pv.s), pv.d, "leaves", "leaves");
      });

      /* --- particelle di linfa --- */
      const pPos = { x: 0, y: 0, z: 0 };
      for (const sp2 of sap) {
        sp2.t += sp2.speed / 60;
        if (sp2.t >= 1) sp2.t -= 1;
        if (sp2.kind === 0 && sp2.pts) {
          pointOnPath(sp2.pts, 1 - sp2.t, pPos);
        } else if (sp2.kind === 1) {
          pointOnPath(s.trunkPath, sp2.t, pPos);
          const a = sp2.t * 26 + sp2.phase;
          pPos.x += Math.cos(a) * 0.16;
          pPos.z += Math.sin(a) * 0.16;
        } else if (sp2.kind === 2) {
          pointOnPath(s.trunkPath, 1 - sp2.t, pPos);
          const a = -sp2.t * 20 + sp2.phase;
          pPos.x += Math.cos(a) * 0.45;
          pPos.z += Math.sin(a) * 0.45;
        } else {
          pointOnPath(s.branchPaths[sp2.branch], sp2.t, pPos);
        }
        const wxp = windX(pPos.x, pPos.y, pPos.z, now, 0.1);
        project(pPos.x + wxp, pPos.y, pPos.z);
        if (!pv.ok) continue;
        const alpha = 0.35 + 0.4 * Math.sin(sp2.t * Math.PI);
        const rr = Math.max(1, 2.3 * (pv.s / 40));
        const col =
          sp2.kind === 2
            ? `rgba(242,206,126,${alpha})`
            : sp2.kind === 0
              ? `rgba(214,226,150,${alpha})`
              : `rgba(232,214,130,${alpha})`;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(pv.x, pv.y, rr, 0, TAU);
        ctx.fill();
        if (sp2.kind !== 0) {
          ctx.fillStyle = col.replace(String(alpha), String(alpha * 0.25));
          ctx.beginPath();
          ctx.arc(pv.x, pv.y, rr * 2.6, 0, TAU);
          ctx.fill();
        }
      }

      /* --- ordinamento pittore (lontano -> vicino) --- */
      order.length = dlCount;
      for (let i = 0; i < dlCount; i++) order[i] = i;
      const dRef = dlD;
      order.sort((a, b) => dRef[b] - dRef[a]);

      const hlSel = computeHighlight(store.selected);
      const hlHov = hover ? computeHighlight(hover) : null;

      for (let oi = 0; oi < dlCount; oi++) {
        const idx = order[oi];
        const kind = dlK[idx];
        const i = dlI[idx];
        if (kind === 0) {
          const g = segs[i];
          const o = i * 6;
          ctx.strokeStyle = g.color;
          ctx.lineWidth = Math.max(0.7, ((g.wa * segBuf[o + 4] + g.wb * segBuf[o + 5]) / 2) * 0.92);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(segBuf[o], segBuf[o + 1]);
          ctx.lineTo(segBuf[o + 2], segBuf[o + 3]);
          ctx.stroke();
        } else if (kind === 1) {
          const lf = leaves[i];
          const o = i * 4;
          const r = leafBuf[o + 2] * (0.85 + 0.3 * density);
          ctx.save();
          ctx.translate(leafBuf[o], leafBuf[o + 1]);
          ctx.rotate(leafBuf[o + 3] * 0.35);
          ctx.globalAlpha = 0.92;
          ctx.fillStyle = lf.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.52, 0, 0, TAU);
          ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 1;
        } else if (kind === 2) {
          const fr = fruits[i];
          const o = i * 3;
          const fx = fruitBuf[o];
          const fy = fruitBuf[o + 1];
          const r = fruitBuf[o + 2];
          /* alone */
          ctx.fillStyle = fr.glow;
          ctx.globalAlpha = 0.13;
          ctx.beginPath();
          ctx.arc(fx, fy, r * 2.05, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
          /* sfera */
          const g = ctx.createRadialGradient(fx - r * 0.35, fy - r * 0.4, r * 0.1, fx, fy, r);
          g.addColorStop(0, "#fdf6df");
          g.addColorStop(0.25, fr.glow);
          g.addColorStop(0.75, fr.color);
          g.addColorStop(1, "rgba(20,14,6,0.9)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(fx, fy, r, 0, TAU);
          ctx.fill();
        }
      }

      /* --- passaggi di evidenziazione --- */
      const pass = (hl: ReturnType<typeof computeHighlight>, glowAlpha: number, ringAlpha: number) => {
        if (hl.segNodes.size) {
          ctx.save();
          ctx.lineCap = "round";
          ctx.shadowColor = `rgba(232,181,74,${glowAlpha})`;
          ctx.shadowBlur = 13;
          ctx.strokeStyle = `rgba(246,222,156,${glowAlpha})`;
          for (let i = 0; i < segs.length; i++) {
            if (!hl.segNodes.has(segs[i].node)) continue;
            const o = i * 6;
            ctx.lineWidth = Math.max(1.4, ((segs[i].wa * segBuf[o + 4] + segs[i].wb * segBuf[o + 5]) / 2) * 1.35);
            ctx.beginPath();
            ctx.moveTo(segBuf[o], segBuf[o + 1]);
            ctx.lineTo(segBuf[o + 2], segBuf[o + 3]);
            ctx.stroke();
          }
          ctx.restore();
        }
        if (hl.fruitIds.size) {
          ctx.strokeStyle = `rgba(246,222,156,${ringAlpha})`;
          ctx.lineWidth = 1.6;
          for (let i = 0; i < fruits.length; i++) {
            if (!hl.fruitIds.has(fruits[i].metricId)) continue;
            const o = i * 3;
            ctx.beginPath();
            ctx.arc(fruitBuf[o], fruitBuf[o + 1], fruitBuf[o + 2] + 4.5, 0, TAU);
            ctx.stroke();
          }
        }
        if (hl.leaves) {
          ctx.strokeStyle = `rgba(196,224,138,${ringAlpha * 0.8})`;
          ctx.lineWidth = 1;
          for (let i = 0; i < leaves.length; i++) {
            if (leaves[i].rand > density) continue;
            const o = i * 4;
            const r = leafBuf[o + 2] * (0.85 + 0.3 * density);
            ctx.beginPath();
            ctx.ellipse(leafBuf[o], leafBuf[o + 1], r + 1.5, r * 0.52 + 1.5, leafBuf[o + 3] * 0.35, 0, TAU);
            ctx.stroke();
          }
        }
      };
      if (hlHov) pass(hlHov, 0.35, 0.4);
      pass(hlSel, 0.85, 0.9);

      /* cornice di selezione sul frutto */
      if (store.selected?.type === "fruit") {
        const fi = fruits.findIndex((f) => f.metricId === store.selected!.id);
        if (fi >= 0) {
          const o = fi * 3;
          ctx.strokeStyle = "rgba(253,246,223,0.9)";
          ctx.setLineDash([4, 5]);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(fruitBuf[o], fruitBuf[o + 1], fruitBuf[o + 2] + 9, now * 0.8, now * 0.8 + TAU);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    raf = requestAnimationFrame(frame);

    /* ---------- interazione ---------- */
    function pickAt(x: number, y: number): Hit | null {
      let best: Hit | null = null;
      for (let i = 0; i < hitCount; i++) {
        const hp = hits[i];
        const dx = hp.x - x;
        const dy = hp.y - y;
        if (dx * dx + dy * dy > hp.r * hp.r) continue;
        if (!best || hp.d < best.d) best = hp;
      }
      return best;
    }

    function updateTooltip(x: number, y: number) {
      const tip = tipRef.current;
      if (!tip) return;
      if (!hover) {
        tip.style.opacity = "0";
        return;
      }
      const info = nodeTooltip(hover);
      if (tipLabelRef.current) tipLabelRef.current.textContent = info.label;
      if (tipValueRef.current) tipValueRef.current.textContent = info.value;
      const tx = Math.min(Math.max(x + 18, 10), w - 230);
      const ty = Math.min(Math.max(y + 14, 10), h - 70);
      tip.style.transform = `translate(${tx}px, ${ty}px)`;
      tip.style.opacity = "1";
    }

    function onPointerDown(e: PointerEvent) {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [p1, p2] = [...pointers.values()];
        pinchD = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      }
      dragging = true;
      moved = false;
      downX = e.clientX;
      downY = e.clientY;
      lastPX = e.clientX;
      lastPY = e.clientY;
      lastInteract = performance.now();
      canvas.classList.add("canvas-grabbing");
      canvas.classList.remove("canvas-pointer");
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        lastInteract = performance.now();
        if (pointers.size === 2) {
          const [p1, p2] = [...pointers.values()];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (pinchD > 0) radius = Math.max(12, Math.min(38, radius * (pinchD / d)));
          pinchD = d;
          moved = true;
          return;
        }
        const dx = e.clientX - lastPX;
        const dy = e.clientY - lastPY;
        if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) moved = true;
        if (moved) {
          theta -= dx * 0.0052;
          phi += dy * 0.0042;
          velT = -dx * 0.0032;
          velP = dy * 0.0026;
          lastPX = e.clientX;
          lastPY = e.clientY;
          hover = null;
          updateTooltip(x, y);
          return;
        }
        lastPX = e.clientX;
        lastPY = e.clientY;
      }
      /* hover */
      const hp = pickAt(x, y);
      const nh = hp ? { type: hp.type, id: hp.id } : null;
      if (nh?.type !== hover?.type || nh?.id !== hover?.id) hover = nh;
      updateTooltip(x, y);
      canvas.classList.toggle("canvas-pointer", !!hp);
    }

    function onPointerUp(e: PointerEvent) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchD = 0;
      if (pointers.size === 0) {
        dragging = false;
        canvas.classList.remove("canvas-grabbing");
        if (!moved) {
          const rect = canvas.getBoundingClientRect();
          const hp = pickAt(e.clientX - rect.left, e.clientY - rect.top);
          if (hp) store.select({ type: hp.type, id: hp.id });
          else store.select(null);
        }
      }
      lastInteract = performance.now();
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      radius = Math.max(12, Math.min(38, radius * (1 + e.deltaY * 0.0009)));
      lastInteract = performance.now();
    }

    function onDblClick() {
      theta = 0.72;
      phi = 0.3;
      radius = 21.5;
      velT = 0;
      velP = 0;
      lastInteract = performance.now();
    }

    function onLeave() {
      hover = null;
      updateTooltip(0, 0);
      canvas.classList.remove("canvas-pointer");
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDblClick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDblClick);
    };
  }, []);

  /* ---------- overlay reattivi ---------- */
  const model = store.getModel();
  const selected = store.selected;
  void version;

  const legend: { label: string; count: string; color: string; sel: NodeSel }[] = [
    { label: "Radici · leve di input", count: "12", color: "#c08a4f", sel: { type: "root", id: "aziende" } },
    { label: "Tronco · patto tra partner", count: "1", color: "#8a6a45", sel: { type: "trunk", id: "trunk" } },
    { label: "Rami · meccaniche operative", count: "5", color: "#8fbf6a", sel: { type: "branch", id: "0" } },
    { label: "Chioma · adozione dei lavoratori", count: "—", color: "#c4e08a", sel: { type: "leaves", id: "leaves" } },
    { label: "Frutti · metriche di risultato", count: "23", color: "#e8b54a", sel: { type: "fruit", id: "m12" } },
  ];

  return (
    <section id="albero" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-moss-950">
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="canvas-grab absolute inset-0 touch-none select-none" />
      </div>
      <div className="stage-vignette pointer-events-none absolute inset-0" />

      {/* intestazione */}
      <div className="pointer-events-none absolute left-5 top-20 z-10 max-w-[min(92vw,620px)] sm:left-10 sm:top-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage">
          Presentazione al Gruppo Illiria
        </p>
        <h1 className="font-display mt-3 text-[clamp(2.1rem,5.4vw,4.4rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
          L'Albero del
          <br />
          <span className="text-amber">Valore Condiviso</span>
        </h1>
        <p className="mt-4 hidden max-w-md text-[15px] leading-relaxed text-sage md:block">
          Un modello in cui la competitività del Gruppo e il benessere del territorio crescono dallo
          stesso tronco. Esploralo: ogni radice, ogni ramo e ogni frutto risponde al clic con i suoi
          dati e i suoi concetti.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {[
            { l: "Valore ecosistema", v: formatValue("eur", model.values["m12"]) },
            { l: "Emissioni evitate", v: formatValue("t", model.values["m11"]) },
            { l: "Valore commerciale", v: formatValue("eur", model.values["m20"]) },
          ].map((c) => (
            <div
              key={c.l}
              className="border border-line bg-moss-900/85 px-3 py-2"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                <span className="live-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-leaf align-middle" />
                {c.l}
              </p>
              <p className="font-mono mt-0.5 text-[15px] font-semibold text-amber-soft">{c.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* legenda / livelli */}
      <div className="absolute bottom-5 left-5 z-10 hidden sm:left-10 sm:block">
        <p className="font-mono mb-2 text-[10px] uppercase tracking-[0.2em] text-dim">
          Anatomia dell'albero — seleziona un livello
        </p>
        <ul className="space-y-1">
          {legend.map((lg) => {
            const active = selected?.type === lg.sel.type;
            return (
              <li key={lg.label}>
                <button
                  onClick={() => store.select(lg.sel)}
                  className={`group flex w-full items-center gap-2.5 border px-2.5 py-1.5 text-left transition-colors ${
                    active
                      ? "border-amber/50 bg-moss-800"
                      : "border-transparent hover:border-line hover:bg-moss-900/80"
                  }`}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                    style={{ backgroundColor: lg.color }}
                  />
                  <span className="text-[13px] font-medium text-sage group-hover:text-ink">
                    {lg.label}
                  </span>
                  <span className="font-mono ml-auto pl-3 text-[11px] text-dim">{lg.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* suggerimento */}
      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden w-max -translate-x-1/2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-dim md:block">
        trascina per orbitare · rotellina o pinch per lo zoom · doppio clic per recentrare
      </p>

      {/* indice dell'albero */}
      <div className="absolute right-4 top-20 z-20 sm:right-6">
        <button
          onClick={() => setIndexOpen((v) => !v)}
          className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
            indexOpen
              ? "border-amber bg-amber text-moss-950"
              : "border-line bg-moss-900/90 text-sage hover:border-amber/60 hover:text-ink"
          }`}
        >
          {indexOpen ? "Chiudi indice" : "Indice dell'albero"}
        </button>
      </div>
      <aside
        className={`absolute bottom-0 right-0 top-0 z-10 w-[300px] max-w-[86vw] overflow-y-auto border-l border-line bg-moss-900/97 py-24 transition-transform duration-300 ${
          indexOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <IndexList onSelect={() => setIndexOpen(window.innerWidth < 1024 ? false : true)} />
      </aside>

      {/* tooltip */}
      <div
        ref={tipRef}
        className="pointer-events-none absolute left-0 top-0 z-30 w-[220px] border border-line bg-moss-900/95 px-3 py-2 opacity-0 transition-opacity duration-150"
      >
        <span ref={tipLabelRef} className="block font-display text-[13px] font-semibold leading-snug text-ink" />
        <span ref={tipValueRef} className="font-mono mt-0.5 block text-[12px] text-amber" />
      </div>
    </section>
  );
}

function IndexList({ onSelect }: { onSelect: () => void }) {
  useStoreVersion();
  const model = store.getModel();
  const selected = store.selected;

  const Row = ({ sel, dot, label, value }: { sel: NodeSel; dot: string; label: string; value: string }) => {
    const active = selected?.type === sel.type && selected?.id === sel.id;
    return (
      <button
        onClick={() => {
          store.select(sel);
          onSelect();
        }}
        className={`flex w-full items-center gap-2 px-4 py-[7px] text-left transition-colors ${
          active ? "bg-moss-700" : "hover:bg-moss-800"
        }`}
      >
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
        <span className={`min-w-0 flex-1 truncate text-[12.5px] ${active ? "text-amber-soft" : "text-sage"}`}>
          {label}
        </span>
        <span className="font-mono shrink-0 text-[11px] text-dim">{value}</span>
      </button>
    );
  };

  const H = ({ children }: { children: string }) => (
    <p className="mt-4 mb-1 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim first:mt-2">
      {children}
    </p>
  );

  return (
    <nav className="pb-10">
      <H>Radici — leve di input</H>
      {INPUTS.map((d) => (
        <Row
          key={d.key}
          sel={{ type: "root", id: d.key }}
          dot="#c08a4f"
          label={d.label}
          value={
            d.unit === "%"
              ? `${fmtInt(store.inputs[d.key])}%`
              : d.unit === "€/anno"
                ? `€ ${fmtInt(store.inputs[d.key])}`
                : fmtInt(store.inputs[d.key])
          }
        />
      ))}
      <H>Tronco</H>
      <Row sel={{ type: "trunk", id: "trunk" }} dot="#8a6a45" label={TRUNK_COPY.title} value="—" />
      <H>Chioma</H>
      <Row
        sel={{ type: "leaves", id: "leaves" }}
        dot="#c4e08a"
        label={LEAVES_COPY.title}
        value={`${fmtInt(model.adozioneMedia * 100)}%`}
      />
      <H>Rami — meccaniche</H>
      {BRANCHES.map((b) => (
        <Row key={b.id} sel={{ type: "branch", id: String(b.id) }} dot="#8fbf6a" label={b.title} value={`${b.id + 1}/5`} />
      ))}
      <H>Frutti — metriche</H>
      {METRICS.map((m) => (
        <Row
          key={m.id}
          sel={{ type: "fruit", id: m.id }}
          dot="#e8b54a"
          label={m.label}
          value={formatValue(m.fmt, model.values[m.id] ?? 0)}
        />
      ))}
    </nav>
  );
}
