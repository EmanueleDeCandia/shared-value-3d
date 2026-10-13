import { useEffect, useRef } from "react";
import { store, useStoreVersion } from "../lib/store";
import {
  INPUT_BY_KEY,
  METRICS,
  METRIC_BY_ID,
  BRANCHES,
  TRUNK_COPY,
  LEAVES_COPY,
  ROOTS_COPY,
  PARTNERS,
  type InputKey,
} from "../lib/model";
import { formatValue, fmtInt } from "../lib/format";

const AREA_LABEL: Record<string, string> = {
  sociale: "Impatto sulle persone",
  ambientale: "Impatto ambientale",
  territoriale: "Impatto sul territorio",
  cultura: "Cultura e spettacolo",
  illiria: "Benefici per il Gruppo Illiria",
};

function scrollToTree() {
  document.getElementById("albero")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function DetailPanel() {
  useStoreVersion();
  const sel = store.selected;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sel && window.innerWidth < 640) {
      /* su mobile il pannello resta visibile senza rubare la scena */
    }
  }, [sel]);

  if (!sel) return null;

  const model = store.getModel();
  let kicker = "";
  let title = "";
  let value = "";
  let body: React.ReactNode = null;

  if (sel.type === "root") {
    const def = INPUT_BY_KEY[sel.id as InputKey];
    const v = store.inputs[def.key];
    kicker = "Radice · leva di input";
    title = def.label;
    value =
      def.unit === "%"
        ? `${fmtInt(v)}%`
        : def.unit === "€" || def.unit === "€/anno"
          ? `€ ${fmtInt(v)}`
          : `${fmtInt(v)} ${def.unit}`;
    const pct = ((v - def.min) / (def.max - def.min)) * 100;
    body = (
      <>
        <p className="text-[13.5px] leading-relaxed text-sage">{def.concept}</p>
        <div className="mt-4 border border-line bg-moss-850 p-3">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Regola la radice
            </span>
            <span className="font-mono text-[11px] text-dim">
              min {fmtInt(def.min)} · max {fmtInt(def.max)}
            </span>
          </div>
          <input
            type="range"
            min={def.min}
            max={def.max}
            step={def.step}
            value={v}
            style={{ "--fill": `${pct}%` } as React.CSSProperties}
            onChange={(e) => store.set(def.key, Number(e.target.value))}
            aria-label={def.label}
          />
          <p className="mt-1 font-mono text-[10.5px] text-dim">
            L'albero si ridisegna in tempo reale: osserva radici e frutti.
          </p>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
          Frutti alimentati da questa radice
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {def.feeds.map((fid) => {
            const m = METRIC_BY_ID[fid];
            return m ? (
              <button
                key={fid}
                onClick={() => store.select({ type: "fruit", id: fid })}
                className="border border-line px-2 py-1 font-mono text-[11px] text-sage transition-colors hover:border-amber/70 hover:text-amber-soft"
              >
                {m.label} · {formatValue(m.fmt, model.values[fid] ?? 0)}
              </button>
            ) : null;
          })}
        </div>
      </>
    );
  } else if (sel.type === "trunk") {
    kicker = "Tronco · struttura portante";
    title = TRUNK_COPY.title;
    value = "investimento Illiria: fiducia";
    body = (
      <>
        <p className="text-[13.5px] leading-relaxed text-sage">{TRUNK_COPY.concept}</p>
        <ul className="mt-4 space-y-2 border-l-2 border-bark pl-3">
          {PARTNERS.slice(0, 3).map((p) => (
            <li key={p.name}>
              <span className="font-display text-[13px] font-semibold text-ink">{p.name}</span>
              <span className="text-[12.5px] text-dim"> — {p.role.toLowerCase()}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border border-amber/35 bg-amber/8 px-3 py-2 text-[12.5px] leading-relaxed text-amber-soft">
          La linfa che sale è il nutrimento dei partner; quella che scende è il ritorno economico e
          reputazionale. Le due correnti chiudono il circuito.
        </p>
      </>
    );
  } else if (sel.type === "branch") {
    const b = BRANCHES[Number(sel.id)];
    kicker = `Ramo · meccanica ${b.id + 1} di 5`;
    title = b.title;
    value = b.tag;
    const branchMetrics = METRICS.filter((m) => m.branch === b.id);
    body = (
      <>
        <p className="text-[13.5px] leading-relaxed text-sage">{b.concept}</p>
        <p className="mt-4 border-l-2 border-amber pl-3 text-[13px] leading-relaxed text-ink">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
            Benefici per Illiria
          </span>
          <br />
          {b.ritorno}
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
          Frutti portati da questo ramo
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {branchMetrics.map((m) => (
            <button
              key={m.id}
              onClick={() => store.select({ type: "fruit", id: m.id })}
              className="border border-line px-2 py-1 font-mono text-[11px] text-sage transition-colors hover:border-amber/70 hover:text-amber-soft"
            >
              {m.label}
            </button>
          ))}
        </div>
      </>
    );
  } else if (sel.type === "leaves") {
    const ad = model.adozioneMedia;
    kicker = "Chioma · fotosintesi del welfare";
    title = LEAVES_COPY.title;
    value = `adozione media ${fmtInt(ad * 100)}%`;
    const bars = [
      { l: INPUT_BY_KEY.hotel.label, v: store.inputs.hotel },
      { l: INPUT_BY_KEY.aper.label, v: store.inputs.aper },
      { l: INPUT_BY_KEY.km0.label, v: store.inputs.km0 },
    ];
    body = (
      <>
        <p className="text-[13.5px] leading-relaxed text-sage">{LEAVES_COPY.concept}</p>
        <div className="mt-4 space-y-2.5">
          {bars.map((b) => (
            <div key={b.l}>
              <div className="flex justify-between font-mono text-[11px] text-dim">
                <span>{b.l}</span>
                <span className="text-leaf-bright">{fmtInt(b.v)}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-moss-700">
                <div className="mbar h-full bg-leaf" style={{ width: `${(b.v / 60) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10.5px] leading-relaxed text-dim">
          Suggerimento: {ROOTS_COPY.title.toLowerCase()} — apri una radice di adozione e spostala,
          la chioma reagisce.
        </p>
      </>
    );
  } else {
    const m = METRIC_BY_ID[sel.id];
    const v = model.values[m.id] ?? 0;
    kicker = "Frutto · metrica di risultato";
    title = m.label;
    value = formatValue(m.fmt, v);
    body = (
      <>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
          {AREA_LABEL[m.area]}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-sage">{m.concept}</p>
        <p className="mt-3 border-l-2 border-line pl-3 text-[12.5px] leading-relaxed text-dim">
          <span className="font-semibold text-sage">Come nasce. </span>
          {m.origin}
        </p>
        {m.roots.length > 0 && (
          <>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
              Radici che lo alimentano — selezionale per modificarle
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.roots.map((r) => {
                const d = INPUT_BY_KEY[r];
                return (
                  <button
                    key={r}
                    onClick={() => store.select({ type: "root", id: r })}
                    className="border border-line px-2 py-1 font-mono text-[11px] text-sage transition-colors hover:border-ochre hover:text-ochre"
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={scrollToTree}
            className="border border-amber/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber transition-colors hover:bg-amber hover:text-moss-950"
          >
            Vedilo sull'albero
          </button>
        </div>
      </>
    );
  }

  return (
    <div
      key={sel.type + sel.id}
      ref={panelRef}
      className="panel-in fixed bottom-3 right-3 z-40 max-h-[70vh] w-[min(93vw,400px)] overflow-y-auto border border-line bg-moss-900 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
      role="dialog"
      aria-label={title}
    >
      <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-moss-900 px-4 pb-2 pt-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">{kicker}</p>
          <h3 className="font-display mt-0.5 text-[17px] font-bold leading-tight text-ink">{title}</h3>
        </div>
        <button
          onClick={() => store.select(null)}
          className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-amber/60 hover:text-amber"
        >
          Chiudi
        </button>
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="font-mono text-[26px] font-semibold leading-none text-amber-soft">{value}</p>
        <div className="mt-3">{body}</div>
      </div>
    </div>
  );
}
