import { useEffect, useRef, useState } from "react";
import { store, useStoreVersion } from "../lib/store";
import {
  PARTNERS,
  BRANCHES,
  METRICS,
  CONSTANTS_TEXT,
  APP_URLS,
  type MetricDef,
} from "../lib/model";
import { formatValue, fmtInt, fmtEur } from "../lib/format";

/* ============ testata + ticker ============ */

export function Header() {
  useStoreVersion();
  const model = store.getModel();
  const items = [
    ["Valore per l'ecosistema", formatValue("eur", model.values["m12"])],
    ["Emissioni evitate", formatValue("t", model.values["m11"])],
    ["Valore Promotore", formatValue("eur", model.values["m20"])],
    ["Abbandono clienti", `da ${fmtInt(store.inputs.churnA)}% a ${fmtInt(store.inputs.churnB)}%`],
    ["Nuovi contratti", formatValue("int", model.values["m17"])],
    ["Investimento monetario Illiria", "fiducia"],
  ] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-moss-950/95 backdrop-blur-[2px]">
      <div className="flex h-14 items-center gap-5 px-5 sm:px-10">
        <a href="#albero" className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-ink">
            Gruppo Illiria
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <span className="font-display hidden text-[13.5px] font-bold text-amber sm:block">
            L'Albero del Valore Condiviso
          </span>
        </a>
        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          {[
            ["L'Albero", "#albero"],
            ["Partner", "#partner"],
            ["Meccaniche", "#meccaniche"],
            ["Plancia", "#plancia"],
            ["Risultati", "#risultati"],
            ["Cruscotto", "#cruscotto"],
          ].map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim transition-colors hover:text-amber-soft"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-6">
          <a
            href={APP_URLS.CLIENTS_LANDING_PAGE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-[11px] font-semibold text-amber transition-all hover:bg-amber/20 hover:text-amber-light shadow-sm"
            title="Apri la proposta per le Imprese Clienti (Landing Page & Reporting ESG)"
          >
            <span>Proposta Clienti</span>
            <span className="text-[10px]">↗</span>
          </a>
          <div className="hidden sm:flex items-center gap-2">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-amber" />
            <span className="font-mono text-[11px] text-sage">
              <span>modello attivo · </span>
              <span className="text-amber-soft">{formatValue("eur", model.values["m12"])}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden border-t border-line-soft bg-moss-900">
        <div className="ticker-track py-1.5">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex shrink-0">
              {items.map(([l, v]) => (
                <span key={l + dup} className="flex items-center">
                  <span className="px-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">
                    {l}
                  </span>
                  <span className="font-mono text-[10.5px] font-semibold text-amber">{v}</span>
                  <span className="ml-4 inline-block h-1 w-1 rounded-full bg-line" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ============ premessa ============ */

export function Premessa() {
  return (
    <section id="premessa" className="relative border-t border-line bg-moss-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rv">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
              01 · Premessa · Shared Value
            </p>
            <h2 className="font-display mt-5 text-[clamp(1.7rem,3.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
              La competitività del Gruppo e il benessere della comunità{" "}
              <span className="text-amber">non sono due partite separate</span>: sono la stessa
              partita, giocata sullo stesso territorio.
            </h2>
            <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-sage">
              Il progetto trasforma tre risorse esistenti: il portafoglio clienti di Illiria, la sua logistica quotidiana e i budget minimi
              che le imprese erogano per i benefit ai dipendenti in promozione dello sviluppo locale. Raddoppia i benefici che le imprese
              clienti destinano ai propri lavoratori con il fondo Matching Grant della Startup Attuatore, crea vantaggi competitivi per i clienti, abilitando le aziende
              ad essere promotrici di impatto economico e sociale.
              <br />
              <br />
              Genera a cascata nuove fonti di revenue per lo spettacolo dal vivo, per l'ospitalità locale e per la filiera corta agro-alimentare.
              Esternalità positive che il Gruppo internalizza con maggiore fidelizzazione e nuove proposte contrattuali basate sulla creazione di
              valore condiviso. Nessun costo nuovo: cambia il modo in cui il Gruppo favorisce sinergie creando impatto in attività e settori diversi.
            </p>
          </div>
          <div className="rv flex flex-col justify-end gap-4" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <blockquote className="border-l-2 border-amber pl-4">
              <p className="font-display text-[17px] font-semibold leading-snug text-ink">
                «Ogni euro di buono welfare ne muove due e mezzo sul territorio, e torna al Gruppo
                sotto forma di clienti che restano e clienti che arrivano da soli.»
              </p>
            </blockquote>
            <div className="grid grid-cols-2 gap-px border border-line bg-line">
              {[
                ["Partner", "tre, più il territorio"],
                ["Investimento Illiria", "Fiducia"],
                ["Metriche tracciate", "23"],
                ["Leve modificabili", "12"],
              ].map(([l, v]) => (
                <div key={l} className="bg-moss-900 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">{l}</p>
                  <p className="font-display mt-1 text-[16px] font-bold text-leaf-bright">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ regole del gioco (costanti) ============ */

export function Regole() {
  return (
    <section className="border-t border-line bg-moss-900 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="rv flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-extrabold tracking-tight text-ink">
            Le regole del gioco, scolpite nel modello
          </h2>
          <p className="max-w-md text-[13.5px] leading-relaxed text-dim">
            Valori fissi che non cambiano con gli scenari: sono le fondamenta contrattuali e
            operative del progetto.
          </p>
        </div>
        <div className="rv mt-8 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" style={{ "--rv-delay": "90ms" } as React.CSSProperties}>
          {CONSTANTS_TEXT.map((c) => (
            <div key={c.label} className="group bg-moss-850 px-4 py-4 transition-colors hover:bg-moss-800">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">{c.label}</p>
              <p className="font-display mt-1.5 text-[15.5px] font-bold leading-snug text-amber-soft transition-colors group-hover:text-amber">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* nota di analisi di sensibilità e sostenibilità */}
        <div
          className="rv mt-6 border-l-2 border-amber/70 bg-moss-850/80 p-5 sm:p-6"
          style={{ "--rv-delay": "140ms" } as React.CSSProperties}
        >
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-amber">
            Nota metodologica e analisi di sensibilità
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-sage">
            Abbiamo testato varie assunzioni sui dati con analisi di sensibilità. La sostenibilità del modello è garantita da:
          </p>
          <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-dim">
            <li className="flex items-start gap-2.5">
              <span className="font-mono font-semibold text-amber-soft">a)</span>
              <span>
                Le proiezioni dei ricavi generati dalla linea di prodotti a filiera corta (km 0) sono state escluse dalle stime per la loro natura altamente aleatoria. Eventuali schemi di monetizzazione o commissioni saranno valutate successivamente sulla base delle metriche di performance effettive. Sul piano operativo, queste partnership prevedono modelli incentrati sull'incentivazione, come la fornitura di reward In-Kind (omaggi/cestini regalo) legati a specifici volumi di conversione nello store collegato alla piattaforma di welfare.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono font-semibold text-amber-soft">b)</span>
              <span>
                Anche azzerando l'impatto del passaparola i risultati principali per Illiria sarebbero comunque irrilevanti rispetto a quelli di proposte fatte direttamente a nuovi clienti; allo stesso modo questi risultati sono irrilevanti per il successo degli eventi locali.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============ partner ============ */

export function Partners() {
  return (
    <section id="partner" className="scroll-mt-28 border-t border-line bg-moss-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="rv">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
            02 · La partnership
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
            Chi mette cosa, sul tavolo e nel tronco
          </h2>
        </div>
        <div className="mt-10 border-t-2 border-line">
          {PARTNERS.map((p, i) => (
            <article
              key={p.name}
              className={`rv group grid gap-x-8 gap-y-3 border-b-2 border-line py-7 transition-colors md:grid-cols-[250px_1fr_1fr] ${p.highlight ? "border-l-4 border-l-amber bg-moss-900 pl-4 md:-ml-4" : "hover:bg-moss-900/60 md:px-0 md:hover:px-2"
                }`}
              style={{ "--rv-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              <div>
                <p className="font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display mt-1 text-[19px] font-extrabold leading-tight text-ink group-hover:text-amber-soft">
                  {p.name}
                </h3>
                <p className="font-mono mt-1 text-[10.5px] uppercase tracking-[0.14em] text-leaf">{p.role}</p>
                {p.badge && (
                  <p className="mt-3 inline-block border border-amber/50 bg-amber/10 px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-amber">
                    {p.badge}
                  </p>
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Semina</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-sage">{p.gives}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Raccoglie</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-sage">{p.gets}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ meccaniche ============ */

export function Flows() {
  return (
    <section id="meccaniche" className="scroll-mt-28 border-t border-line bg-moss-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="rv">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
            03 · Le cinque meccaniche
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
            I cinque rami che trasformano il nutrimento in raccolto
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-sage">
            Ogni ramo dell'albero è una meccanica operativa: sull'albero interattivo puoi
            selezionarli uno a uno; qui li trovi distesi, con il ritorno esplicito per il Gruppo.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {BRANCHES.map((b, i) => (
            <button
              key={b.id}
              onClick={() => {
                store.select({ type: "branch", id: String(b.id) });
              }}
              className="rv group grid w-full gap-x-8 gap-y-4 border border-line-soft bg-moss-850 px-5 py-7 text-left transition-all hover:border-leaf/50 hover:bg-moss-800 md:grid-cols-[110px_1fr_340px] md:px-8"
              style={{ "--rv-delay": `${i * 70}ms` } as React.CSSProperties}
              title="Apri la scheda della meccanica"
            >
              <span className="ghost-num font-display text-[64px] font-extrabold leading-none md:text-[84px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-leaf">{b.tag}</span>
                <span className="font-display mt-1.5 block text-[clamp(1.15rem,2vw,1.55rem)] font-bold leading-tight text-ink">
                  {b.title}
                </span>
                <span className="mt-3 block max-w-xl text-[14px] leading-relaxed text-sage">{b.concept}</span>
              </span>
              <span className="block border-l-2 border-amber pl-4 md:self-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
                  Benefici per Illiria
                </span>
                <span className="mt-2 block text-[13.5px] leading-relaxed text-ink">{b.ritorno}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ risultati ============ */

function MetricRow({ m, index }: { m: MetricDef; index: number }) {
  useStoreVersion();
  const model = store.getModel();
  const v = model.values[m.id] ?? 0;
  const def = (model.defaults[m.id] ?? 1) * 2.2;
  const pct = Math.min(100, (v / def) * 100);
  return (
    <button
      onClick={() => {
        store.select({ type: "fruit", id: m.id });
      }}
      className="group grid w-full grid-cols-[36px_1fr_auto] items-center gap-x-4 border-b border-line-soft px-3 py-3.5 text-left transition-colors hover:bg-moss-800 sm:grid-cols-[44px_240px_1fr_auto]"
      title="Apri la scheda dell'indicatore"
    >
      <span className="font-mono text-[11px] text-dim">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-semibold text-ink group-hover:text-amber-soft">
          {m.label}
        </span>
        <span className="mt-0.5 hidden text-[12px] leading-snug text-dim sm:block">{m.origin}</span>
      </span>
      <span className="hidden h-1.5 self-center bg-moss-700 sm:block">
        <span className="mbar block h-full bg-leaf/80 group-hover:bg-amber" style={{ width: `${pct}%` }} />
      </span>
      <span className="value-flash font-mono text-right text-[15px] font-semibold text-amber-soft" key={String(v)}>
        {formatValue(m.fmt, v)}
      </span>
    </button>
  );
}

export function Results() {
  const groups: { title: string; color: string; items: MetricDef[] }[] = [
    { title: "Frutti: Persone e welfare", color: "#ffffff", items: METRICS.filter((m) => m.area === "sociale") },
    { title: "Frutti: Ambiente e logistica", color: "#7fb6a4", items: METRICS.filter((m) => m.area === "ambientale") },
    { title: "Frutti: Territorio e filiera", color: "#8fbf6a", items: METRICS.filter((m) => m.area === "territoriale") },
    { title: "Frutti: Cultura e spettacolo", color: "#e39a6b", items: METRICS.filter((m) => m.area === "cultura") },
    { title: "Frutti: Impatto Gruppo Illiria", color: "#ef4444", items: METRICS.filter((m) => m.area === "illiria") },
  ];
  let idx = -1;
  return (
    <section id="risultati" className="scroll-mt-28 border-t border-line bg-moss-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="rv flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
              05 · I risultati
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
              Ventitré frutti, uno per metrica
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-dim">
            Ogni riga è un frutto dell'albero: selezionala per vederla in quota, con le radici che
            la alimentano e i concetti che la spiegano.
          </p>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {groups.map((g, gi) => (
            <div key={g.title} className={`rv ${gi === 4 ? "lg:col-span-2" : ""}`} style={{ "--rv-delay": `${gi * 60}ms` } as React.CSSProperties}>
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                <h3 className="font-display text-[15px] font-bold uppercase tracking-wide text-ink">{g.title}</h3>
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-[11px] text-dim">{g.items.length} metriche</span>
              </div>
              <div className="border-t border-line">
                {g.items.map((m) => {
                  idx++;
                  return <MetricRow key={m.id} m={m} index={idx} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ cruscotto ============ */

function Num({ value, format, big }: { value: number; format: (v: number) => string; big?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [f, setF] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const step = (t: number) => {
            const p = Math.min(1, (t - t0) / 950);
            setF(1 - Math.pow(1 - p, 3));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span
      ref={ref}
      className={`font-mono font-semibold tabular-nums text-amber-soft whitespace-nowrap ${big ? "text-[clamp(1.75rem,3.8vw,3.35rem)]" : "text-[clamp(1.5rem,3vw,2.3rem)]"}`}
    >
      {format(value * f)}
    </span>
  );
}

export function Dashboard() {
  useStoreVersion();
  const model = store.getModel();
  const v = model.values;
  return (
    <section id="cruscotto" className="scroll-mt-28 border-t border-line bg-[#080d0a] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="rv">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
            06 · Cruscotto finale
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
            La stagione del raccolto, in quattro sguardi
          </h2>
        </div>

        <div className="mt-12 grid gap-px border border-line bg-line lg:grid-cols-12">
          <div className="rv bg-moss-900 p-6 sm:p-7 lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Persone</p>
            <div className="mt-4 space-y-4">
              <div>
                <Num value={v["m1"]} format={(x) => fmtInt(x)} big />
                <p className="mt-1 text-[13px] text-sage">lavoratori raggiunti dal welfare territoriale</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-line-soft pt-4">
                <div>
                  <Num value={v["m3"]} format={(x) => fmtInt(x)} />
                  <p className="mt-1 text-[12px] leading-snug text-dim">biglietti per spettacoli, lavoratore più accompagnatore</p>
                </div>
                <div>
                  <Num value={v["m13"]} format={(x) => fmtInt(x)} />
                  <p className="mt-1 text-[12px] leading-snug text-dim">ambasciatori con il Certificato Welfare e Impatto</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rv bg-moss-900 p-6 sm:p-7 lg:col-span-3" style={{ "--rv-delay": "80ms" } as React.CSSProperties}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal">Ambiente</p>
            <div className="mt-4 space-y-4">
              <div>
                <Num value={v["m11"]} format={(x) => formatValue("t", x)} big />
                <p className="mt-1 text-[13px] text-sage">di anidride carbonica mai emessa</p>
              </div>
              <div className="border-t border-line-soft pt-4">
                <Num value={v["m10"]} format={(x) => fmtInt(x)} />
                <p className="mt-1 text-[12px] leading-snug text-dim">chilometri evitati grazie alla logistica condivisa</p>
              </div>
            </div>
          </div>

          <div className="rv bg-moss-900 p-6 sm:p-7 lg:col-span-5" style={{ "--rv-delay": "140ms" } as React.CSSProperties}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-leaf-bright">Territorio</p>
            <div className="mt-4">
              <Num value={v["m12"]} format={(x) => fmtEur(x)} big />
              <p className="mt-1 text-[13px] text-sage">valore generato per l'ecosistema in un anno</p>
            </div>
            <ul className="mt-4 space-y-2 border-t border-line-soft pt-4 text-[12.5px] text-dim">
              <li className="flex justify-between gap-3">
                <span>Fatturato agricolo</span>
                <span className="font-mono text-sage">{fmtEur(v["m9"])}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Spesa indotta locale</span>
                <span className="font-mono text-sage">{fmtEur(v["m6"])}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Fondo biglietti della Startup</span>
                <span className="font-mono text-sage">{fmtEur(v["m4"])}</span>
              </li>
            </ul>
          </div>

          <div className="rv bg-moss-900 p-7 lg:col-span-12" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">
                Valore Promotore · Gruppo Illiria
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                investimento monetario diretto <span className="font-semibold text-amber">non necessario</span>
              </p>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr_1.35fr]">
              <div>
                <Num value={v["m21"] * 100} format={(x) => `−${fmtInt(x)}%`} big />
                <p className="mt-1.5 text-[13px] text-sage">
                  riduzione dell'abbandono clienti: da {fmtInt(store.inputs.churnA)}% a {fmtInt(store.inputs.churnB)}%
                </p>
              </div>
              <div>
                <Num value={v["m18"]} format={(x) => fmtInt(x)} big />
                <p className="mt-1.5 text-[13px] text-sage">
                  imprese trattenute, per <span className="font-mono text-amber-soft">{fmtEur(v["m19"])}</span> di valore preservato
                </p>
              </div>
              <div>
                <Num value={v["m17"]} format={(x) => fmtInt(x)} big />
                <p className="mt-1.5 text-[13px] text-sage">
                  nuovi contratti enterprise con costo di acquisizione ridotto per la rete commerciale
                </p>
              </div>
              <div className="border border-amber/40 bg-amber/5 p-4 sm:p-5">
                <Num value={v["m20"]} format={(x) => fmtEur(x)} big />
                <p className="mt-1.5 text-[13px] text-amber-soft">
                  valore promotore, generato e protetto
                </p>
              </div>
            </div>
            <p className="mt-6 border-t border-line-soft pt-4 text-[13.5px] leading-relaxed text-dim">
              I valori non monetizzabili sono spesso i più importanti e esclusi dal calcolo: il posizionamento come partner di sviluppo locale
              per le più grandi aziende delle Marche, le relazioni istituzionali con la Regione che conosce e sostiene questo modello di intervento, le partneship con gli enti pubblici locali,
              e
              la forte barriera competitiva di differenziazione dai competitor che fanno leva sul prezzo dei prodotti e dai costosi servizi che rimangono pur sempre collegati ad un prodotto facilmente sostituibile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ prossimi passi + chiusura ============ */

export function NextSteps() {
  const steps = [
    {
      n: "01",
      t: "Perimetro pilota",
      d: "Si parte dal portafoglio clienti esistenti: le imprese con relazioni consolidate e la flotta che le rifornisce. Il territorio del pilota è quello dove la rete di produttori e ospitalità è pronta.",
    },
    {
      n: "02",
      t: "Attivazione della piattaforma",
      d: "Convenzioni, buoni welfare, calendario degli spettacoli e listino dei cesti a Km 0. La Startup apre le proposte alla rete territoriale, coinvolge i clienti del Gruppo con il budget Biglietti.",
    },
    {
      n: "03",
      t: "Misurazione e scaling",
      d: "Ogni trimestre si valutano i risultati del pilota: quante imprese aderiscono, quante avviano un percorso CSR, quante nuove imprese aderiscono alla value proposition che unisce welfare, competitività, territorio e cultura.",
    },
  ];
  return (
    <section className="border-t border-line bg-moss-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="rv">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
              07 · Avvio del progetto
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
              Tre passi per avviare il pilota
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-sage">
              Il modello è sfidante ma senza salti nel buio: ogni step utilizza risorse di fiducia che il Gruppo possiede già, ogni avanzamento è misurabile dai risultati che si manifestano contestualmente alle attività.
            </p>
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="rv group flex gap-6 border border-line-soft bg-moss-900 px-6 py-6 transition-colors hover:border-amber/40"
                style={{ "--rv-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <span className="ghost-num font-display text-[44px] font-extrabold leading-none">{s.n}</span>
                <div>
                  <h3 className="font-display text-[17px] font-bold text-ink group-hover:text-amber-soft">{s.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-sage">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-moss-900 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-display text-[22px] font-extrabold text-ink">
            L'Albero del <span className="text-amber">Valore Condiviso</span>
          </p>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-dim">
            Progetto integrato di Shared Value e Welfare Territoriale. Partnership tra Gruppo
            Illiria, Startup Innovativa e imprese clienti, a beneficio dell'ecosistema locale.
          </p>
        </div>
        <div className="space-y-2 lg:text-right">
          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            <a
              href={APP_URLS.CLIENTS_LANDING_PAGE}
              target="_blank"
              rel="noreferrer"
              className="text-[12.5px] font-bold uppercase tracking-wider text-amber transition-colors hover:text-amber-light hover:underline"
            >
              Proposta Imprese Clienti &amp; ESG ↗
            </a>
            <a
              href="#albero"
              className="text-[12.5px] font-medium uppercase tracking-wider text-[#ffffff] transition-colors hover:text-[#e4e4e7] hover:underline"
            >
              L&apos;Albero 3D
            </a>
            <a
              href="#plancia"
              className="text-[12.5px] font-medium uppercase tracking-wider text-[#ffffff] transition-colors hover:text-[#e4e4e7] hover:underline"
            >
              Simulatore Plancia
            </a>
            <a
              href="#partner"
              className="text-[12.5px] font-medium uppercase tracking-wider text-[#ffffff] transition-colors hover:text-[#e4e4e7] hover:underline"
            >
              Stakeholder
            </a>
          </div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sage pt-1">
            Gruppo Illiria · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
