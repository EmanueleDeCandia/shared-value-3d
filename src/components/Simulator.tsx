import { store, useStoreVersion } from "../lib/store";
import { INPUTS, PRESETS, DEFAULT_INPUTS, type InputDef } from "../lib/model";
import { formatValue, fmtInt } from "../lib/format";

const GROUP_LABEL: Record<InputDef["group"], string> = {
  popolazione: "Popolazione servita",
  adozione: "Adozione dei benefit",
  logistica: "Logistica condivisa",
  commerciale: "Dinamica commerciale",
};

function Slider({ def }: { def: InputDef }) {
  const v = store.inputs[def.key];
  const pct = ((v - def.min) / (def.max - def.min)) * 100;
  const display =
    def.unit === "%" ? `${fmtInt(v)}%` : def.unit === "€" || def.unit === "€/anno" ? `€ ${fmtInt(v)}` : `${fmtInt(v)} ${def.unit}`;
  return (
    <label className="group block border border-line-soft bg-moss-850 px-3.5 py-3 transition-colors hover:border-line">
      <div className="flex items-baseline justify-between gap-3">
        <button
          type="button"
          onClick={() => store.select({ type: "root", id: def.key })}
          className="truncate text-left text-[13px] font-medium text-sage transition-colors hover:text-amber-soft"
          title="Apri la radice corrispondente sull'albero"
        >
          {def.label}
        </button>
        <span className="value-flash font-mono shrink-0 text-[13.5px] font-semibold text-amber-soft" key={v}>
          {display}
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
      <div className="flex justify-between font-mono text-[10px] text-dim">
        <span>{fmtInt(def.min)}</span>
        <span>{fmtInt(def.max)}</span>
      </div>
    </label>
  );
}

export default function Simulator() {
  useStoreVersion();
  const model = store.getModel();

  const groups = (["popolazione", "adozione", "logistica", "commerciale"] as const).map((g) => ({
    g,
    items: INPUTS.filter((d) => d.group === g),
  }));

  const strip = [
    { l: "Lavoratori raggiunti", v: formatValue("int", model.values["m1"]) },
    { l: "Budget welfare", v: formatValue("eur", model.values["m5"]) },
    { l: "Fatturato filiera", v: formatValue("eur", model.values["m9"]) },
    { l: "Emissioni evitate", v: formatValue("t", model.values["m11"]) },
    { l: "Nuovi contratti", v: formatValue("int", model.values["m17"]) },
    { l: "Valore Promotore", v: formatValue("eur", model.values["m20"]) },
  ];

  return (
    <section id="plancia" className="relative border-t border-line bg-moss-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="rv flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
              04 · Plancia di controllo
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
              Muovi le radici,
              <br />
              pesa i frutti
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-sage">
              Dodici parametri governano l'intero modello: popolazione servita, tassi di adozione,
              tratte logistiche e dinamica commerciale. Ogni modifica ricalcola all'istante tutte le
              ventitré metriche e ridisegna l'albero. Premi l'indicatore per aprire la scheda.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full lg:w-auto lg:min-w-[500px]">
            {PRESETS.map((p) => {
              const isActive = (Object.keys(p.values) as (keyof typeof p.values)[]).every(
                (k) => store.inputs[k] === p.values[k]
              );
              return (
                <button
                  key={p.id}
                  onClick={() => store.applyPreset(p.values)}
                  className={`w-full min-h-[50px] px-3.5 py-2.5 flex items-center justify-center text-center border transition-all ${isActive
                      ? "border-amber bg-amber/15 text-amber-soft ring-1 ring-amber/50 font-semibold shadow-[0_0_12px_rgba(235,178,74,0.12)]"
                      : "border-line bg-moss-850 text-sage hover:border-amber/60 hover:text-amber-soft"
                    }`}
                  title={p.note}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] leading-snug">
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {groups.map(({ g, items }, gi) => (
              <div key={g} className="rv" style={{ "--rv-delay": `${gi * 70}ms` } as React.CSSProperties}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[15px] font-bold uppercase tracking-wide text-leaf-bright">
                    {GROUP_LABEL[g]}
                  </h3>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((d) => (
                    <Slider key={d.key} def={d} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="rv lg:sticky lg:top-24 lg:self-start" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <div className="border border-amber/30 bg-moss-850">
              <p className="border-b border-amber/25 px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-amber">
                Letture istantanee
              </p>
              <ul>
                {strip.map((s, i) => (
                  <li
                    key={s.l}
                    className={`flex items-baseline justify-between gap-3 px-4 py-2.5 ${i > 0 ? "border-t border-line-soft" : ""
                      }`}
                  >
                    <span className="text-[12.5px] text-sage">{s.l}</span>
                    <span className="value-flash font-mono text-[14px] font-semibold text-amber-soft" key={s.v}>
                      {s.v}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-amber/25 px-4 py-3 text-[12px] leading-relaxed text-dim">
                Le assunzioni sono conservative per favorire la trasparenza e l'unità di misura delle stime è un solo evento da 6 a 8 spettacoli in un mese. A regime gli eventi in programma sono 2 in ogni Provincia della Regione Marche per un totale di 10.
              </p>
            </div>
            <button
              onClick={() => store.applyPreset(DEFAULT_INPUTS)}
              className="mt-3 w-full border border-line py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-sage transition-colors hover:border-amber/60 hover:text-amber-soft"
            >
              Ripristina lo scenario base
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
