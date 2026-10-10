/* ============================================================
   Geometria procedurale dell'Albero del Valore
   Grafo gerarchico: radici -> tronco -> rami -> foglie -> frutti
   Nessuna libreria grafica: solo matematica vettoriale.
   ============================================================ */

import {
  INPUTS,
  METRICS,
  type InputKey,
  type InputValues,
  type ModelOutput,
  DEFAULT_OUTPUT,
  type AreaId,
} from "./model";

export interface Vec {
  x: number;
  y: number;
  z: number;
}

export interface Seg {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  wa: number;
  wb: number;
  color: string;
  node: string;
  kind: "root" | "trunk" | "branch";
}

export interface Leaf {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
  color: string;
  rand: number;
}

export interface LeafCluster {
  x: number;
  y: number;
  z: number;
  r: number;
}

export interface Fruit {
  x: number;
  y: number;
  z: number;
  r: number;
  phase: number;
  color: string;
  glow: string;
  metricId: string;
}

export interface RootPath {
  id: InputKey;
  pts: Vec[];
  flow: number;
}

export interface Scene {
  segs: Seg[];
  leaves: Leaf[];
  clusters: LeafCluster[];
  fruits: Fruit[];
  rootPaths: RootPath[];
  trunkPath: Vec[];
  branchPaths: Vec[][];
  branchTips: { x: number; y: number; z: number; b: number }[];
  trunkW: number;
  topY: number;
  density: number;
}

/* ---------- rng deterministico ---------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`;
}

function mixColor(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number, t: number): string {
  return hsl(h1 + (h2 - h1) * t, s1 + (s2 - s1) * t, l1 + (l2 - l1) * t);
}

/* rotazione di v attorno ad asse unitario (Rodrigues) */
function rotAxis(v: Vec, axis: Vec, ang: number, out: Vec): Vec {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const d = axis.x * v.x + axis.y * v.y + axis.z * v.z;
  const cx = axis.y * v.z - axis.z * v.y;
  const cy = axis.z * v.x - axis.x * v.z;
  const cz = axis.x * v.y - axis.y * v.x;
  out.x = v.x * c + cx * s + axis.x * d * (1 - c);
  out.y = v.y * c + cy * s + axis.y * d * (1 - c);
  out.z = v.z * c + cz * s + axis.z * d * (1 - c);
  return out;
}

function norm(v: Vec): Vec {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  v.x /= l;
  v.y /= l;
  v.z /= l;
  return v;
}

const UP: Vec = { x: 0, y: 1, z: 0 };

export const AREA_COLORS: Record<AreaId, { base: string; glow: string }> = {
  sociale: { base: hsl(40, 72, 58), glow: hsl(43, 85, 68) },
  ambientale: { base: hsl(163, 32, 58), glow: hsl(163, 45, 70) },
  territoriale: { base: hsl(88, 42, 56), glow: hsl(92, 55, 68) },
  cultura: { base: hsl(24, 62, 60), glow: hsl(28, 78, 72) },
  illiria: { base: hsl(45, 80, 66), glow: hsl(48, 92, 78) },
};

const LEAF_COLORS = [
  hsl(100, 34, 42),
  hsl(108, 38, 48),
  hsl(92, 40, 52),
  hsl(116, 30, 38),
  hsl(84, 46, 55),
];

export function pointOnPath(pts: Vec[], t: number, out: Vec): Vec {
  const n = pts.length - 1;
  const ft = Math.min(0.9999, Math.max(0, t)) * n;
  const i = Math.floor(ft);
  const f = ft - i;
  out.x = pts[i].x + (pts[i + 1].x - pts[i].x) * f;
  out.y = pts[i].y + (pts[i + 1].y - pts[i].y) * f;
  out.z = pts[i].z + (pts[i + 1].z - pts[i].z) * f;
  return out;
}

export function buildScene(inputs: InputValues, model: ModelOutput): Scene {
  const rng = mulberry32(20260214);
  const segs: Seg[] = [];
  const leaves: Leaf[] = [];
  const clusters: LeafCluster[] = [];
  const fruits: Fruit[] = [];
  const rootPaths: RootPath[] = [];
  const branchTips: Scene["branchTips"] = [];

  const density = Math.min(1.12, 0.5 + model.adozioneMedia * 1.15);

  /* ---------- tronco ---------- */
  const budget = model.values["m5"];
  const th = 0.72 + 0.45 * Math.min(1.4, budget / 64125);
  const topY = 7.3;
  const trunkPath: Vec[] = [];
  const TN = 13;
  for (let i = 0; i < TN; i++) {
    const y = (i / (TN - 1)) * topY;
    trunkPath.push({
      x: 0.15 * Math.sin(y * 0.72 + 0.5),
      y,
      z: 0.13 * Math.cos(y * 0.9 + 0.2),
    });
  }
  for (let i = 0; i < TN - 1; i++) {
    const t = i / (TN - 2);
    const wa = (0.8 - 0.44 * (i / (TN - 1))) * th;
    const wb = (0.8 - 0.44 * ((i + 1) / (TN - 1))) * th;
    let color = mixColor(28, 26, 20, 34, 30, 32, t);
    if (i % 4 === 2) color = mixColor(70, 18, 24, 80, 20, 30, t); // banda muschiata
    segs.push({
      ax: trunkPath[i].x,
      ay: trunkPath[i].y,
      az: trunkPath[i].z,
      bx: trunkPath[i + 1].x,
      by: trunkPath[i + 1].y,
      bz: trunkPath[i + 1].z,
      wa,
      wb,
      color,
      node: "trunk",
      kind: "trunk",
    });
  }

  /* ---------- radici: una per leva di input ---------- */
  INPUTS.forEach((def, i) => {
    const v = inputs[def.key];
    const norm01 = (v - def.min) / (def.max - def.min);
    const flow = (0.25 + 0.75 * norm01) * def.weight;
    const az = (i / INPUTS.length) * TAU + (rng() - 0.5) * 0.22;
    const curl = (rng() - 0.5) * 0.75;
    const spread = 2.5 + 3.0 * flow;
    const depth = 2.2 + 2.7 * flow;

    const p0: Vec = { x: 0.52 * Math.cos(az), y: -0.04, z: 0.52 * Math.sin(az) };
    const p1: Vec = {
      x: 1.55 * Math.cos(az + 0.06),
      y: -0.75 - 0.5 * flow,
      z: 1.55 * Math.sin(az + 0.06),
    };
    const p2: Vec = {
      x: spread * 0.72 * Math.cos(az + curl * 0.55),
      y: -depth * 0.72,
      z: spread * 0.72 * Math.sin(az + curl * 0.55),
    };
    const p3: Vec = {
      x: spread * Math.cos(az + curl),
      y: -depth,
      z: spread * Math.sin(az + curl),
    };

    const N = 15;
    const pts: Vec[] = [];
    const hueJ = (rng() - 0.5) * 8;
    for (let k = 0; k < N; k++) {
      const t = k / (N - 1);
      const u = 1 - t;
      pts.push({
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
        z: u * u * u * p0.z + 3 * u * u * t * p1.z + 3 * u * t * t * p2.z + t * t * t * p3.z,
      });
    }
    rootPaths.push({ id: def.key, pts, flow });

    const baseW = 0.09 + 0.22 * flow;
    for (let k = 0; k < N - 1; k++) {
      const t = k / (N - 2);
      segs.push({
        ax: pts[k].x,
        ay: pts[k].y,
        az: pts[k].z,
        bx: pts[k + 1].x,
        by: pts[k + 1].y,
        bz: pts[k + 1].z,
        wa: baseW * Math.pow(1 - t, 0.85) + 0.015,
        wb: baseW * Math.pow(1 - (t + 1 / (N - 2)), 0.85) + 0.015,
        color: mixColor(26 + hueJ, 34, 30, 22 + hueJ, 30, 13, t),
        node: `root:${def.key}`,
        kind: "root",
      });
    }

    /* radichette laterali */
    for (const at of [5, 9]) {
      const s0 = pts[at];
      const sideAz = az + curl * (at / N) + (at === 5 ? 0.7 : -0.65);
      const s1: Vec = {
        x: s0.x + 1.15 * Math.cos(sideAz),
        y: s0.y - 0.85 - rng() * 0.7,
        z: s0.z + 1.15 * Math.sin(sideAz),
      };
      const mid: Vec = {
        x: (s0.x + s1.x) / 2 + (rng() - 0.5) * 0.3,
        y: (s0.y + s1.y) / 2 - 0.25,
        z: (s0.z + s1.z) / 2 + (rng() - 0.5) * 0.3,
      };
      const M = 6;
      let prev = s0;
      for (let k = 1; k < M; k++) {
        const t = k / (M - 1);
        const u = 1 - t;
        const p: Vec = {
          x: u * u * s0.x + 2 * u * t * mid.x + t * t * s1.x,
          y: u * u * s0.y + 2 * u * t * mid.y + t * t * s1.y,
          z: u * u * s0.z + 2 * u * t * mid.z + t * t * s1.z,
        };
        segs.push({
          ax: prev.x,
          ay: prev.y,
          az: prev.z,
          bx: p.x,
          by: p.y,
          bz: p.z,
          wa: baseW * 0.4 * (1 - t) + 0.01,
          wb: baseW * 0.4 * (1 - t - 1 / (M - 1)) + 0.008,
          color: mixColor(24 + hueJ, 32, 24, 20 + hueJ, 28, 11, t),
          node: `root:${def.key}`,
          kind: "root",
        });
        prev = p;
      }
    }
  });

  /* ---------- rami: uno per meccanica, con sotto-rami ---------- */
  const branchPaths: Vec[][] = [];
  const branchEndDirs: Vec[][] = []; // direzioni terminali livello 2

  for (let b = 0; b < 5; b++) {
    const az = ((-90 + b * 72 + (rng() - 0.5) * 14) * Math.PI) / 180;
    const elev = 0.52 + rng() * 0.22;
    const L = 3.3 + rng() * 1.0;
    const attachY = topY - 1.6 + (b % 3) * 0.55;

    const start: Vec = {
      x: 0.34 * th * Math.cos(az),
      y: attachY,
      z: 0.34 * th * Math.sin(az),
    };
    let dir: Vec = norm({
      x: Math.cos(az) * Math.cos(elev),
      y: Math.sin(elev),
      z: Math.sin(az) * Math.cos(elev),
    });

    const main: Vec[] = [start];
    const MN = 8;
    const axis: Vec = { x: 0, y: 0, z: 0 };
    for (let k = 0; k < MN; k++) {
      const hor: Vec = norm({ x: -dir.z, y: 0, z: dir.x });
      rotAxis(dir, hor, 0.055 + rng() * 0.035, dir);
      rotAxis(dir, UP, (rng() - 0.5) * 0.16, dir);
      const p = main[main.length - 1];
      main.push({
        x: p.x + dir.x * (L / MN),
        y: p.y + dir.y * (L / MN),
        z: p.z + dir.z * (L / MN),
      });
    }
    branchPaths.push(main);

    for (let k = 0; k < MN; k++) {
      const t = k / MN;
      segs.push({
        ax: main[k].x,
        ay: main[k].y,
        az: main[k].z,
        bx: main[k + 1].x,
        by: main[k + 1].y,
        bz: main[k + 1].z,
        wa: (0.26 - 0.16 * t) * th,
        wb: (0.26 - 0.16 * (t + 1 / MN)) * th,
        color: mixColor(30, 26, 24, 36, 30, 33, t),
        node: `branch:${b}`,
        kind: "branch",
      });
    }

    /* livello 2 */
    const tip = main[main.length - 1];
    const childDirs: Vec[] = [];
    for (let c = 0; c < 3; c++) {
      let d2: Vec = { x: dir.x, y: dir.y, z: dir.z };
      const hor: Vec = norm({ x: -d2.z, y: 0, z: d2.x });
      rotAxis(d2, hor, 0.35 + rng() * 0.45, d2);
      rotAxis(d2, UP, (c - 1) * (0.75 + rng() * 0.3) + (rng() - 0.5) * 0.2, d2);
      norm(d2);
      childDirs.push(d2);
      const L2 = 1.7 + rng() * 0.7;
      const CN = 5;
      let prev: Vec = tip;
      axis.x = hor.x;
      axis.y = hor.y;
      axis.z = hor.z;
      for (let k = 1; k <= CN; k++) {
        const t = k / CN;
        const p: Vec = {
          x: prev.x + d2.x * (L2 / CN),
          y: prev.y + d2.y * (L2 / CN) + 0.045,
          z: prev.z + d2.z * (L2 / CN),
        };
        segs.push({
          ax: prev.x,
          ay: prev.y,
          az: prev.z,
          bx: p.x,
          by: p.y,
          bz: p.z,
          wa: 0.09 * (1 - t) + 0.035,
          wb: 0.09 * (1 - t - 1 / CN) + 0.032,
          color: mixColor(33, 27, 27, 40, 32, 36, t),
          node: `branch:${b}`,
          kind: "branch",
        });
        prev = p;
      }
      branchTips.push({ x: prev.x, y: prev.y, z: prev.z, b });
      addLeafCluster(prev, 9, rng);

      /* livello 3: rametti */
      for (let tw = 0; tw < 2; tw++) {
        let d3: Vec = { x: d2.x, y: d2.y, z: d2.z };
        const h3: Vec = norm({ x: -d3.z, y: 0, z: d3.x });
        rotAxis(d3, h3, 0.4 + rng() * 0.4, d3);
        rotAxis(d3, UP, (tw === 0 ? -1 : 1) * (0.5 + rng() * 0.4), d3);
        norm(d3);
        const L3 = 0.8 + rng() * 0.5;
        let pp: Vec = prev;
        for (let k = 1; k <= 3; k++) {
          const t = k / 3;
          const q: Vec = {
            x: pp.x + d3.x * (L3 / 3),
            y: pp.y + d3.y * (L3 / 3) + 0.03,
            z: pp.z + d3.z * (L3 / 3),
          };
          segs.push({
            ax: pp.x,
            ay: pp.y,
            az: pp.z,
            bx: q.x,
            by: q.y,
            bz: q.z,
            wa: 0.032 * (1 - t) + 0.012,
            wb: 0.032 * (1 - t - 1 / 3) + 0.01,
            color: mixColor(36, 28, 30, 44, 34, 39, t),
            node: `branch:${b}`,
            kind: "branch",
          });
          pp = q;
        }
        addLeafCluster(pp, 6, rng);
      }
    }
    branchEndDirs.push(childDirs);
  }

  function addLeafCluster(center: Vec, count: number, r: () => number) {
    clusters.push({ x: center.x, y: center.y + 0.25, z: center.z, r: 0.95 });
    for (let k = 0; k < count; k++) {
      const a1 = r() * TAU;
      const a2 = (r() - 0.35) * Math.PI * 0.6;
      const rad = 0.3 + r() * 0.62;
      leaves.push({
        x: center.x + Math.cos(a1) * Math.cos(a2) * rad,
        y: center.y + 0.22 + Math.sin(a2) * rad * 0.8 + r() * 0.2,
        z: center.z + Math.sin(a1) * Math.cos(a2) * rad,
        size: 0.2 + r() * 0.2,
        phase: r() * TAU,
        color: LEAF_COLORS[Math.floor(r() * LEAF_COLORS.length)],
        rand: r(),
      });
    }
  }

  /* ---------- frutti: uno per metrica ---------- */
  METRICS.forEach((m) => {
    const main = branchPaths[m.branch];
    const siblings = METRICS.filter((x) => x.branch === m.branch);
    const j = siblings.indexOf(m);
    const val = model.values[m.id] ?? 0;
    const def = DEFAULT_OUTPUT[m.id] ?? 1;
    const maturity = Math.min(1, Math.max(0.06, val / (def * 1.0)) / 2.3);
    const r = 0.26 + 0.4 * maturity;

    let anchor: Vec;
    const nMain = Math.ceil(siblings.length * 0.55);
    if (j < nMain) {
      const t = 0.42 + (j / Math.max(1, nMain - 1)) * 0.5;
      anchor = { x: 0, y: 0, z: 0 };
      pointOnPath(main, t, anchor);
      const d = norm({
        x: main[Math.min(main.length - 1, Math.ceil(t * (main.length - 1)))].x - anchor.x || 0.1,
        y: 0,
        z: main[Math.min(main.length - 1, Math.ceil(t * (main.length - 1)))].z - anchor.z || 0.1,
      });
      const side = j % 2 === 0 ? 1 : -1;
      anchor.x += -d.z * 0.3 * side;
      anchor.z += d.x * 0.3 * side;
      anchor.y -= 0.3;
    } else {
      const tips = branchTips.filter((tp) => tp.b === m.branch);
      const tp = tips[(j - nMain) % tips.length];
      anchor = { x: tp.x + (rng() - 0.5) * 0.2, y: tp.y - 0.34, z: tp.z + (rng() - 0.5) * 0.2 };
    }

    const col = AREA_COLORS[m.area];
    fruits.push({
      x: anchor.x,
      y: anchor.y,
      z: anchor.z,
      r,
      phase: rng() * TAU,
      color: col.base,
      glow: col.glow,
      metricId: m.id,
    });

    /* picciolo */
    segs.push({
      ax: anchor.x,
      ay: anchor.y + r * 0.9 + 0.24,
      az: anchor.z,
      bx: anchor.x,
      by: anchor.y + r * 0.55,
      bz: anchor.z,
      wa: 0.02,
      wb: 0.02,
      color: hsl(34, 28, 27),
      node: `fruit:${m.id}`,
      kind: "branch",
    });
  });

  return {
    segs,
    leaves,
    clusters,
    fruits,
    rootPaths,
    trunkPath,
    branchPaths,
    branchTips,
    trunkW: 0.8 * th,
    topY,
    density,
  };
}
