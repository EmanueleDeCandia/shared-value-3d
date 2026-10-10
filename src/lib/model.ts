/* ============================================================
   Modello dati del progetto Shared Value & Welfare Territoriale
   Partnership: Gruppo Illiria, Startup Innovativa, Imprese Clienti
   ============================================================ */

export type InputKey =
  | "aziende"
  | "dip"
  | "hotel"
  | "aper"
  | "km0"
  | "freq"
  | "km"
  | "churnA"
  | "churnB"
  | "prospect"
  | "chiusura"
  | "clv";

export interface InputDef {
  key: InputKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  def: number;
  group: "popolazione" | "adozione" | "logistica" | "commerciale";
  /** peso visivo sulla morfologia delle radici */
  weight: number;
  concept: string;
  feeds: string[]; // id dei frutti alimentati
}

export const INPUTS: InputDef[] = [
  {
    key: "aziende",
    label: "Aziende clienti attive",
    unit: "imprese",
    min: 10,
    max: 400,
    step: 5,
    def: 150,
    group: "popolazione",
    weight: 1.0,
    concept:
      "Le imprese del portafoglio Illiria che attivano la convenzione welfare. Sono la prima radice dell'albero: più aziende entrano, più il sistema si ancora al tessuto economico locale.",
    feeds: ["m1", "m18", "m20"],
  },
  {
    key: "dip",
    label: "Dipendenti medi per azienda",
    unit: "persone",
    min: 5,
    max: 120,
    step: 1,
    def: 30,
    group: "popolazione",
    weight: 0.95,
    concept:
      "La taglia media di ogni impresa cliente. Definisce quante persone raggiungono i benefit all'interno di ciascun contratto: è la radice che dà profondità alla popolazione servita.",
    feeds: ["m1"],
  },
  {
    key: "hotel",
    label: "Adozione buono soggiorno",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: 16,
    group: "adozione",
    weight: 0.8,
    concept:
      "La quota di lavoratori che utilizza il buono da 50 euro per dormire in hotel e agriturismi del territorio. Misura quanto il welfare riesce a mettere in moto l'ospitalità locale.",
    feeds: ["m2", "m5"],
  },
  {
    key: "aper",
    label: "Adozione buono ristorazione",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: 25,
    group: "adozione",
    weight: 0.8,
    concept:
      "La quota di lavoratori che sceglie il buono da 25 euro per aperitivi tipici e ristorazione. È la radice che alimenta bar, trattorie e cantine della filiera dell'accoglienza.",
    feeds: ["m2", "m5"],
  },
  {
    key: "km0",
    label: "Adozione spesa contadina",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: 20,
    group: "adozione",
    weight: 0.85,
    concept:
      "La quota di dipendenti che ordina i cesti di prodotti agricoli a chilometro zero. Trasforma la pausa pranzo in un atto di economia territoriale.",
    feeds: ["m7", "m8", "m9"],
  },
  {
    key: "freq",
    label: "Ordini di cesti all'anno",
    unit: "ordini/anno",
    min: 1,
    max: 12,
    step: 1,
    def: 6,
    group: "adozione",
    weight: 0.7,
    concept:
      "Quante volte l'anno ciascun acquirente ripete l'ordine del cesto contadino. La fedeltà dell'acquisto è ciò che trasforma l'iniziativa in reddito ricorrente per i produttori.",
    feeds: ["m8", "m9"],
  },
  {
    key: "km",
    label: "Tratta logistica evitata",
    unit: "km per consegna",
    min: 10,
    max: 200,
    step: 5,
    def: 50,
    group: "logistica",
    weight: 0.65,
    concept:
      "I chilometri che un corriere dedicato percorrerebbe per ogni consegna. I furgoni Illiria, già in giro per i rifornimenti, li azzerano: questa radice misura la strada che non viene consumata.",
    feeds: ["m10", "m11"],
  },
  {
    key: "churnA",
    label: "Abbandono attuale dei clienti",
    unit: "%",
    min: 0,
    max: 30,
    step: 1,
    def: 10,
    group: "commerciale",
    weight: 0.75,
    concept:
      "Il tasso di abbandono annuo del servizio distributori nello scenario di partenza. È la misura di quanto valore, oggi, sfugge dalle radici.",
    feeds: ["m18", "m21"],
  },
  {
    key: "churnB",
    label: "Abbandono con welfare attivo",
    unit: "%",
    min: 0,
    max: 30,
    step: 1,
    def: 2,
    group: "commerciale",
    weight: 0.75,
    concept:
      "Il tasso di abbandono quando il welfare è attivo: disdire il servizio significherebbe togliere un benefit ai dipendenti, e questo cambia la conversazione con il cliente.",
    feeds: ["m18", "m21"],
  },
  {
    key: "prospect",
    label: "Generazione di richieste spontanee",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: 30,
    group: "commerciale",
    weight: 0.7,
    concept:
      "La quota di ambasciatori le cui segnalazioni diventano richieste spontanee verso altre aziende: i dipendenti chiedono al proprio ufficio HR di attivare la convenzione.",
    feeds: ["m16", "m17"],
  },
  {
    key: "chiusura",
    label: "Tasso di chiusura dei contratti",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: 20,
    group: "commerciale",
    weight: 0.7,
    concept:
      "Quante delle richieste generate dal passaparola diventano contratti firmati. Arrivano già calde: è il cliente che ha chiesto di entrare.",
    feeds: ["m17", "m20"],
  },
  {
    key: "clv",
    label: "Valore medio cliente all'anno",
    unit: "€/anno",
    min: 2000,
    max: 50000,
    step: 500,
    def: 12000,
    group: "commerciale",
    weight: 0.9,
    concept:
      "Il valore medio annuo di un cliente enterprise per il Gruppo Illiria. È il metro con cui si pesa ogni impresa trattenuta e ogni nuovo contratto firmato.",
    feeds: ["m19", "m20"],
  },
];

export const INPUT_BY_KEY: Record<InputKey, InputDef> = Object.fromEntries(
  INPUTS.map((d) => [d.key, d])
) as Record<InputKey, InputDef>;

/* ---------------- costanti invarianti (solo testo) ---------------- */

export const CONSTANTS_TEXT = [
  { label: "Buono soggiorno e agriturismo", value: "50 euro a lavoratore" },
  { label: "Buono ristorazione e degustazione", value: "25 euro a lavoratore" },
  { label: "Scontrino medio del cesto contadino", value: "30 euro a ordine" },
  { label: "Copertura biglietti spettacolo", value: "25 euro, interamente a carico della Startup" },
  { label: "Biglietti per beneficiario", value: "due: lavoratore più accompagnatore" },
  { label: "Moltiplicatore della spesa sul territorio", value: "due euro e mezzo per ogni euro di buono" },
  { label: "Quota di beneficiari che invita altri colleghi", value: "uno su quattro" },
  { label: "Inviti medi per ambasciatore", value: "cinque" },
  { label: "Conversione del passaparola", value: "uno su quattro" },
];

/* ---------------- frutti: metriche di output ---------------- */

export type AreaId = "sociale" | "ambientale" | "territoriale" | "cultura" | "illiria";

export interface MetricDef {
  id: string;
  label: string;
  area: AreaId;
  branch: number; // indice del ramo (0..4)
  fmt: "int" | "eur" | "km" | "t" | "pct" | "k";
  concept: string;
  origin: string; // come nasce, in parole
  roots: InputKey[]; // radici che lo alimentano
  constant?: boolean;
}

export const METRICS: MetricDef[] = [
  {
    id: "m1",
    label: "Lavoratori raggiunti",
    area: "sociale",
    branch: 0,
    fmt: "int",
    concept:
      "Tutte le persone che lavorano nelle imprese clienti: il perimetro entro cui il welfare può mettere radici e germogliare.",
    origin: "Nasce dal numero di aziende moltiplicato per i dipendenti medi di ciascuna.",
    roots: ["aziende", "dip"],
  },
  {
    id: "m2",
    label: "Beneficiari attivi",
    area: "sociale",
    branch: 0,
    fmt: "int",
    concept:
      "I lavoratori che scelgono almeno un buono welfare: da loro parte la stagione dei frutti, perché ogni beneficiario attiva l'intero circuito.",
    origin: "Nasce dalla popolazione raggiunta, nella misura della più partecipata tra le due adesioni ai buoni.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m5",
    label: "Budget welfare attivato",
    area: "territoriale",
    branch: 0,
    fmt: "eur",
    concept:
      "I buoni soggiorno e i buoni ristorazione finanziati dalle imprese attingendo a budget che sono già integralmente deducibili.",
    origin: "Nasce dai lavoratori che usano il buono da 50 euro per dormire e da quelli che usano il buono da 25 euro per mangiare.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m6",
    label: "Spesa indotta sul territorio",
    area: "territoriale",
    branch: 0,
    fmt: "eur",
    concept:
      "Ogni euro di buono ne muove due e mezzo tra negozi, servizi e attività locali: è il moltiplicatore che il weekend sul territorio accende.",
    origin: "Nasce dal budget welfare complessivo moltiplicato per il fattore di indotto territoriale.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m7",
    label: "Acquirenti della filiera",
    area: "territoriale",
    branch: 1,
    fmt: "int",
    concept: "I dipendenti che ordinano i cesti contadini: la domanda stabile che permette ai produttori di programmare i raccolti.",
    origin: "Nasce dalla popolazione raggiunta nella misura dell'adesione alla spesa contadina.",
    roots: ["aziende", "dip", "km0"],
  },
  {
    id: "m8",
    label: "Consegne annue",
    area: "territoriale",
    branch: 1,
    fmt: "int",
    concept:
      "Gli ordini dell'anno, tutti trasportati in groppa ai passaggi che i furgoni Illiria compiono comunque per rifornire i distributori.",
    origin: "Nasce dagli acquirenti moltiplicati per gli ordini che ciascuno ripete in un anno.",
    roots: ["aziende", "dip", "km0", "freq"],
  },
  {
    id: "m9",
    label: "Fatturato della filiera",
    area: "territoriale",
    branch: 1,
    fmt: "eur",
    concept: "Il valore che arriva direttamente a produttori, botteghe e cantine locali: reddito agricolo nuovo, senza intermediari.",
    origin: "Nasce dalle consegne annue valorizzate allo scontrino medio del cesto contadino.",
    roots: ["aziende", "dip", "km0", "freq"],
  },
  {
    id: "m10",
    label: "Logistica stradale evitata",
    area: "ambientale",
    branch: 1,
    fmt: "km",
    concept: "I chilometri che i corrieri avrebbero percorso per le stesse consegne e che invece restano a zero, perché il viaggio esisteva già.",
    origin: "Nasce dalle consegne annue moltiplicate per la tratta media che ciascuna risparmierebbe.",
    roots: ["aziende", "dip", "km0", "freq", "km"],
  },
  {
    id: "m11",
    label: "Emissioni evitate",
    area: "ambientale",
    branch: 1,
    fmt: "t",
    concept:
      "Le tonnellate di anidride carbonica che non entrano in atmosfera grazie ai passaggi condivisi: il dato che finisce nel dossier verde spendibile nelle gare.",
    origin: "Nasce dai chilometri evitati, applicando il coefficiente di emissione dell'autotrasporto.",
    roots: ["aziende", "dip", "km0", "freq", "km"],
  },
  {
    id: "m3",
    label: "Biglietti omaggio emessi",
    area: "sociale",
    branch: 2,
    fmt: "int",
    concept: "Ogni beneficiario porta con sé un accompagnatore: i biglietti raddoppiano e l'esperienza diventa condivisa.",
    origin: "Nasce dai beneficiari attivi: due biglietti per ciascuno.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m4",
    label: "Valore del fondo biglietti",
    area: "cultura",
    branch: 2,
    fmt: "eur",
    concept:
      "Il valore dei biglietti coperto dal fondo della Startup: nessun costo per Illiria, nessun costo per le imprese, nessun costo per i lavoratori.",
    origin: "Nasce dai biglietti emessi, ciascuno coperto integralmente per 25 euro.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "c1",
    label: "Artisti retribuiti per evento",
    area: "cultura",
    branch: 3,
    fmt: "int",
    concept: "Musicisti, attori, tecnici e maestranze locali che vengono scritturati e pagati per ogni appuntamento del cartellone.",
    origin: "Valore di progetto: venti professionisti dello spettacolo a evento.",
    roots: [],
    constant: true,
  },
  {
    id: "c2",
    label: "Spettatori per edizione",
    area: "cultura",
    branch: 3,
    fmt: "int",
    concept: "Il pubblico che riempie la sala a ogni edizione: lavoratori, famiglie e cittadini che vivono il territorio di sera.",
    origin: "Valore di progetto: circa mille spettatori per edizione.",
    roots: [],
    constant: true,
  },
  {
    id: "m12",
    label: "Valore generato per l'ecosistema",
    area: "territoriale",
    branch: 3,
    fmt: "eur",
    concept:
      "La somma di fatturato agricolo, spesa indotta e fondo biglietti: la ricchezza che l'albero riversa sul territorio in un anno.",
    origin: "Nasce sommando il fatturato della filiera, la spesa indotta e il valore del fondo biglietti.",
    roots: ["aziende", "dip", "hotel", "aper", "km0", "freq"],
  },
  {
    id: "m13",
    label: "Ambasciatori del welfare",
    area: "illiria",
    branch: 4,
    fmt: "int",
    concept:
      "Un beneficiario su quattro, al termine dell'esperienza, riceve il Certificato Welfare e Impatto e diventa promotore presso colleghi di altre aziende.",
    origin: "Nasce dai beneficiari attivi: uno su quattro si fa portavoce.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m14",
    label: "Inviti generati",
    area: "illiria",
    branch: 4,
    fmt: "int",
    concept: "Ogni ambasciatore invita in media cinque colleghi: è il passaparola organizzato che la piattaforma rende misurabile.",
    origin: "Nasce dagli ambasciatori moltiplicati per gli inviti medi di ciascuno.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m15",
    label: "Indice di viralità",
    area: "illiria",
    branch: 4,
    fmt: "k",
    concept:
      "Il motore di crescita del modello: ogni cento beneficiari, il passaparola ne attiva trentuno di nuovi nelle aziende vicine. Un volano che gira da solo.",
    origin: "Nasce dalla quota di chi invita, per gli inviti di ciascuno, per la conversione del passaparola. È una costante del modello: il volano è progettato, non sperato.",
    roots: [],
  },
  {
    id: "m16",
    label: "Aziende interessate",
    area: "illiria",
    branch: 4,
    fmt: "int",
    concept: "Le imprese che manifestano interesse grazie alle segnalazioni dei dipendenti: richieste che arrivano dal basso, già motivate.",
    origin: "Nasce dagli ambasciatori nella misura della generazione di richieste spontanee.",
    roots: ["aziende", "dip", "hotel", "aper", "prospect"],
  },
  {
    id: "m17",
    label: "Nuovi contratti firmati",
    area: "illiria",
    branch: 4,
    fmt: "int",
    concept: "Le firme che arrivano senza alcuna spesa commerciale: il costo di acquisizione di questi clienti è zero.",
    origin: "Nasce dalle aziende interessate nella misura del tasso di chiusura.",
    roots: ["aziende", "dip", "hotel", "aper", "prospect", "chiusura"],
  },
  {
    id: "m18",
    label: "Imprese clienti trattenute",
    area: "illiria",
    branch: 4,
    fmt: "int",
    concept:
      "I clienti che restano perché il welfare rende sconveniente andarsene: revocare il servizio significherebbe togliere un benefit ai dipendenti.",
    origin: "Nasce dalla differenza tra l'abbandono attuale e l'abbandono con welfare attivo, applicata al numero di aziende.",
    roots: ["aziende", "churnA", "churnB"],
  },
  {
    id: "m19",
    label: "Valore preservato dalla retention",
    area: "illiria",
    branch: 4,
    fmt: "eur",
    concept: "Il fatturato che non evapora con l'abbandono evitato: ogni impresa trattenuta vale il suo intero canone annuo.",
    origin: "Nasce dalle imprese trattenute valorizzate al valore medio cliente.",
    roots: ["aziende", "churnA", "churnB", "clv"],
  },
  {
    id: "m20",
    label: "Valore commerciale complessivo",
    area: "illiria",
    branch: 4,
    fmt: "eur",
    concept:
      "Clienti salvati più clienti nuovi, valutati al loro valore annuo: è la risposta economica del modello, ottenuta a investimento monetario diretto nullo.",
    origin: "Nasce dalla somma di imprese trattenute e nuovi contratti, moltiplicata per il valore medio cliente.",
    roots: ["aziende", "dip", "hotel", "aper", "prospect", "chiusura", "churnA", "churnB", "clv"],
  },
  {
    id: "m21",
    label: "Riduzione dell'abbandono",
    area: "illiria",
    branch: 4,
    fmt: "pct",
    concept: "Di quanto si riduce il tasso di abbandono: da problema strutturale del servizio a fisiologia di mercato.",
    origin: "Nasce dal confronto tra l'abbandono attuale e quello con welfare attivo.",
    roots: ["churnA", "churnB"],
  },
];

export const METRIC_BY_ID: Record<string, MetricDef> = Object.fromEntries(
  METRICS.map((m) => [m.id, m])
);

/* ---------------- rami: le cinque meccaniche ---------------- */

export interface BranchDef {
  id: number;
  title: string;
  tag: string;
  concept: string;
  ritorno: string;
}

export const BRANCHES: BranchDef[] = [
  {
    id: 0,
    title: "Welfare aziendale dai budget esistenti",
    tag: "Origine del valore",
    concept:
      "Le imprese clienti finanziano buoni da 50 euro per soggiorni in hotel e agriturismi e da 25 euro per aperitivi tipici e ristorazione, attingendo interamente a budget già deducibili. La piattaforma della Startup emette, valida e riscuote i buoni in digitale, senza carta né rimborsi.",
    ritorno:
      "Illiria siede al tavolo della Direzione HR e dell'Amministratore Delegato come abilitatore del welfare, superando la logica di commodity legata al prezzo della cialda.",
  },
  {
    id: 1,
    title: "Filiera contadina a emissioni aggiuntive nulle",
    tag: "Logistica condivisa",
    concept:
      "I dipendenti ordinano cesti di prodotti locali via piattaforma. I furgoni tecnici di Illiria, già pianificati per il rifornimento e l'igienizzazione dei distributori, li prelevano e li consegnano sul posto di lavoro. Nessun mezzo extra su strada: costo di trasporto azzerato per i produttori ed emissioni dedicate annullate.",
    ritorno:
      "Si crea un dossier certificato di compensazione delle emissioni e di logistica verde, spendibile con punteggi tecnici premianti nei capitolati di gara pubblici e privati.",
  },
  {
    id: 2,
    title: "Fondo biglietti e ospitalità territoriale",
    tag: "Leva della Startup",
    concept:
      "La Startup copre interamente i biglietti di spettacoli ed eventi culturali, venticinque euro per il dipendente e per il suo accompagnatore. Il biglietto abilita i buoni soggiorno e ristorazione: il weekend sul territorio avviene a costi vivi minimi e accende una spesa accessoria che moltiplica il valore per due e mezzo.",
    ritorno:
      "Visibilità e co-branding per Illiria come promotore ufficiale dell'esperienza nel tempo libero dei lavoratori.",
  },
  {
    id: 3,
    title: "Cultura, spettacolo e rendicontazione ESG",
    tag: "Impatto certificato",
    concept:
      "Ogni evento retribuisce venti artisti e maestranze locali davanti a circa mille spettatori. Le imprese partner inseriscono i risultati nel Bilancio di Sostenibilità e nel Report ESG con metriche oggettive e certificate, non con dichiarazioni di intenti.",
    ritorno:
      "Una piattaforma di PR e CSR congiunta, con casi operativi documentati a supporto della rete commerciale nelle gare e nelle offerte integrate.",
  },
  {
    id: 4,
    title: "Passaparola dei lavoratori e fedeltà dei clienti",
    tag: "Motore di crescita",
    concept:
      "Al termine dell'esperienza il dipendente riceve il Certificato Welfare e Impatto e invita i colleghi di altre aziende a chiedere al proprio ufficio HR l'attivazione della convenzione. Le direzioni HR ricevono richieste spontanee dal basso. Intanto, disdire il servizio distributori significherebbe revocare il benefit ai dipendenti: una barriera all'uscita che protegge il portafoglio.",
    ritorno:
      "Acquisizione di nuovi clienti enterprise a costo commerciale zero e fidelizzazione del portafoglio esistente: il churn crolla perché il cliente non vuole perdere il welfare.",
  },
];

/* ---------------- tronco e chioma ---------------- */

export const TRUNK_COPY = {
  title: "Il patto tra i partner",
  concept:
    "Il tronco è il patto che tiene insieme il sistema: porta in quota le risorse delle radici — i budget delle imprese, la logistica di Illiria, la piattaforma e il fondo della Startup — e le trasforma in welfare, cultura e reddito territoriale. Al suo interno scorrono due linfe contrapposte: quella che sale è il nutrimento dei partner, quella che scende è il ritorno economico e reputazionale che rinsalda le radici.",
};

export const LEAVES_COPY = {
  title: "La chioma dell'adozione",
  concept:
    "Le foglie sono i lavoratori che partecipano: trasformano l'adesione ai benefit in valore, come la fotosintesi trasforma la luce. Più alta è l'adozione, più la chioma è fitta e più il sistema cattura fiducia, acquisti e passaparola. Quando i parametri cambiano, la chioma si infoltisce o si dirada sotto i tuoi occhi.",
};

export const ROOTS_COPY = {
  title: "Le dodici leve",
  concept:
    "Le radici sono i parametri che controlli: popolazione servita, tassi di adozione, tratte logistiche, dinamica commerciale. Modificale nella plancia e guarda l'albero ridisegnarsi: radici più vigorose alimentano frutti più pesanti.",
};

/* ---------------- partner ---------------- */

export interface PartnerDef {
  name: string;
  role: string;
  gives: string;
  gets: string;
  highlight?: boolean;
  badge?: string;
}

export const PARTNERS: PartnerDef[] = [
  {
    name: "Gruppo Illiria",
    role: "Abilitatore territoriale",
    gives:
      "Portafoglio clienti consolidato, relazioni fiduciarie con le direzioni HR e logistica dell'ultimo miglio: i furgoni già in strada per manutenzione e rifornimento dei distributori.",
    gets:
      "Posizionamento strategico al tavolo HR, dossier ESG spendibile nelle gare, acquisizione a costo zero, portafoglio protetto dall'abbandono.",
    highlight: true,
    badge: "Investimento monetario diretto: 0 euro",
  },
  {
    name: "Startup Innovativa",
    role: "Motore tecnologico e finanziario",
    gives:
      "Piattaforma cloud per emissione, validazione e riscatto dei voucher, accreditamento della rete territoriale, fondo per la copertura integrale dei biglietti, strumenti di crescita e passaparola.",
    gets: "Un canale di distribuzione enterprise già caldo e una rete territoriale accreditata e attiva.",
  },
  {
    name: "Imprese clienti",
    role: "Finanziatrici del welfare",
    gives: "Budget già deducibili destinati al welfare dei propri dipendenti, senza costi aggiuntivi di struttura.",
    gets:
      "Dipendenti più legati all'azienda, metriche certificate per il Bilancio di Sostenibilità, convenzione richiesta dal basso.",
  },
  {
    name: "Lavoratori",
    role: "Fruitori e ambasciatori",
    gives: "Partecipazione alle esperienze e passaparola verso i colleghi di altre aziende, con il Certificato Welfare e Impatto in mano.",
    gets: "Spesa contadina, tempo libero, ospitalità e cultura a costi vivi minimi, sul proprio territorio.",
  },
  {
    name: "Ecosistema territoriale",
    role: "Rete dell'offerta",
    gives: "Produttori agricoli, hotel e agriturismi, ristorazione, artisti e compagnie di spettacolo: l'offerta che rende vera l'esperienza.",
    gets: "Domanda ricorrente e programmabile, incassi senza intermediari, pubblico nuovo per la cultura.",
  },
];

/* ---------------- calcolo del modello ---------------- */

export type InputValues = Record<InputKey, number>;

export interface ModelOutput {
  values: Record<string, number>; // metric id -> valore
  defaults: Record<string, number>; // metric id -> valore con parametri di default
  popolazione: number;
  adozioneMedia: number; // 0..1
}

function computeModelValues(inp: InputValues): Record<string, number> {
  const hotel = inp.hotel / 100;
  const aper = inp.aper / 100;
  const km0 = inp.km0 / 100;
  const churnA = inp.churnA / 100;
  const churnB = inp.churnB / 100;
  const prospect = inp.prospect / 100;
  const chiusura = inp.chiusura / 100;

  const popolazione = inp.aziende * inp.dip;
  const seed = popolazione * Math.max(hotel, aper);
  const biglietti = seed * 2;
  const mg = biglietti * 25;
  const budget = popolazione * hotel * 50 + popolazione * aper * 25;
  const indotto = budget * 2.5;
  const acq = popolazione * km0;
  const consegne = acq * inp.freq;
  const fatturato = consegne * 30;
  const kmEvitati = consegne * inp.km;
  const co2t = (kmEvitati * 0.19) / 1000;
  const eco = fatturato + indotto + mg;
  const amb = seed * 0.25;
  const inviti = amb * 5;
  const kf = 0.25 * 5 * 0.25;
  const prosp = amb * prospect;
  const contratti = prosp * chiusura;
  const dChurn = Math.max(0, churnA - churnB);
  const salvate = inp.aziende * dChurn;
  const risparmio = salvate * inp.clv;
  const b2b = (salvate + contratti) * inp.clv;
  const churnRel = churnA > 0 ? dChurn / churnA : 0;

  return {
    m1: popolazione,
    m2: seed,
    m3: biglietti,
    m4: mg,
    m5: budget,
    m6: indotto,
    m7: acq,
    m8: consegne,
    m9: fatturato,
    m10: kmEvitati,
    m11: co2t,
    m12: eco,
    m13: amb,
    m14: inviti,
    m15: kf,
    m16: prosp,
    m17: contratti,
    m18: salvate,
    m19: risparmio,
    m20: b2b,
    m21: churnRel,
    c1: 20,
    c2: 1000,
  };
}

const DEF_INPUTS: InputValues = Object.fromEntries(
  INPUTS.map((d) => [d.key, d.def])
) as InputValues;

export const DEFAULT_INPUTS: InputValues = DEF_INPUTS;

export const DEFAULT_OUTPUT: Record<string, number> = computeModelValues(DEF_INPUTS);

export function computeModel(inp: InputValues): ModelOutput {
  const hotel = inp.hotel / 100;
  const aper = inp.aper / 100;
  const km0 = inp.km0 / 100;
  const popolazione = inp.aziende * inp.dip;

  return {
    values: computeModelValues(inp),
    defaults: DEFAULT_OUTPUT,
    popolazione,
    adozioneMedia: (hotel + aper + km0) / 3,
  };
}

/* ---------------- preset di scenario ---------------- */

export const PRESETS: { id: string; label: string; note: string; values: InputValues }[] = [
  {
    id: "base",
    label: "Scenario base",
    note: "I parametri di riferimento del progetto",
    values: DEF_INPUTS,
  },
  {
    id: "prudente",
    label: "Scenario prudenziale",
    note: "Avvio su perimetro ridotto e adozioni caute",
    values: {
      aziende: 60,
      dip: 20,
      hotel: 10,
      aper: 15,
      km0: 12,
      freq: 4,
      km: 30,
      churnA: 10,
      churnB: 5,
      prospect: 20,
      chiusura: 15,
      clv: 9000,
    },
  },
  {
    id: "ambizioso",
    label: "Scenario ambizioso",
    note: "Rete a pieno regime entro il secondo anno",
    values: {
      aziende: 300,
      dip: 45,
      hotel: 30,
      aper: 40,
      km0: 35,
      freq: 9,
      km: 80,
      churnA: 12,
      churnB: 1,
      prospect: 45,
      chiusura: 30,
      clv: 18000,
    },
  },
];
