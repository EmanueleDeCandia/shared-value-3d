/* ============================================================
   Modello dati del progetto Shared Value & Welfare Territoriale
   Partnership: Gruppo Illiria, Startup Innovativa, Imprese Clienti
   Single Source of Truth: pacchetto shared-value-core
   ============================================================ */

import {
  INVARIANT_CONSTANTS,
  SCENARIO_REGIME_200,
  SCENARIO_PILOTA_150,
  APP_URLS,
} from "shared-value-core";

export { INVARIANT_CONSTANTS, SCENARIO_REGIME_200, SCENARIO_PILOTA_150, APP_URLS };

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
    max: 500,
    step: 5,
    def: SCENARIO_REGIME_200.aziende, // 200 imprese
    group: "popolazione",
    weight: 1.0,
    concept:
      "Le imprese del portafoglio Illiria che aderiscono alla convenzione di welfare aziendale a regime nell'Area Interna. Sono la prima radice dell'albero: più aziende partecipano, maggiore è l'effetto traino, più la misura si radica nel tessuto economico locale.",
    feeds: ["m1", "m18", "m20"],
  },
  {
    key: "dip",
    label: "Dipendenti medi per azienda",
    unit: "persone",
    min: 5,
    max: 200,
    step: 1,
    def: SCENARIO_REGIME_200.dipendentiPerAzienda, // 40 addetti medi (8.000 lavoratori complessivi)
    group: "popolazione",
    weight: 0.95,
    concept:
      "La taglia media di ogni impresa cliente. Definisce il numero medio di addetti che hanno diritto per obbligo normativo al benefit: è la radice che dà profondità alla popolazione servita.",
    feeds: ["m1"],
  },
  {
    key: "hotel",
    label: "Adozione buono soggiorno",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.tassoAdesioneHotel * 100), // 22%
    group: "adozione",
    weight: 0.8,
    concept:
      "La quota di lavoratori che utilizza il buono da 50 euro per dormire in hotel e agriturismi del territorio. Misura quanto il welfare riesce a mettere in moto l'ospitalità locale: le adesioni effettive al Voucher di Welfare Aziendale.",
    feeds: ["m2", "m5"],
  },
  {
    key: "aper",
    label: "Adozione Voucher Aperitivo-Cena",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.tassoAdesioneFood * 100), // 32%
    group: "adozione",
    weight: 0.8,
    concept:
      "La quota di lavoratori che sceglie il buono da 25 euro per Aperitivo-Cena collegato agli Spettacoli ed eventi locali. È la radice che alimenta una linea di entrata della Startup.",
    feeds: ["m2", "m5"],
  },
  {
    key: "km0",
    label: "Acquisto Prodotti Km 0",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.tassoAdozioneKm0 * 100), // 20%
    group: "adozione",
    weight: 0.85,
    concept:
      "La quota di dipendenti che ordina cestini da 30€ di prodotti a chilometro zero: risparmio di tempo necessario per fare la spesa di alta qualità favorendo produttori con basso accesso al mercato. Illiria crea sinergie e un forte impatto all'economia territoriale.",
    feeds: ["m7", "m8", "m9"],
  },
  {
    key: "freq",
    label: "Ordini di cesti all'anno",
    unit: "ordini/anno",
    min: 1,
    max: 12,
    step: 1,
    def: SCENARIO_REGIME_200.frequenzaAcquistiKm0, // 6 ordini/anno
    group: "adozione",
    weight: 0.7,
    concept:
      "Quante volte l'anno ciascun addetto delle imprese clienti ripete l'ordine del cesto a Km 0 (cadenza ogni circa due mesi). La fedeltà dell'acquisto è ciò che trasforma l'iniziativa in reddito ricorrente per i produttori (9.600 panieri totali per 288.000 €).",
    feeds: ["m8", "m9"],
  },
  {
    key: "km",
    label: "Tratta logistica evitata",
    unit: "km per consegna",
    min: 10,
    max: 200,
    step: 5,
    def: SCENARIO_REGIME_200.trattaLogisticaEvitataKm, // 50 km
    group: "logistica",
    weight: 0.65,
    concept:
      "I chilometri medi che il produttore locale farebbe per ogni consegna in proprio. I mezzi Illiria che condividono lo stesso percorso logistico per i rifornimenti li azzera. Questa radice misura i km evitati.",
    feeds: ["m10", "m11"],
  },
  {
    key: "churnA",
    label: "Abbandono attuale dei clienti",
    unit: "%",
    min: 0,
    max: 30,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.churnRateAsIs * 100), // 10%
    group: "commerciale",
    weight: 0.75,
    concept:
      "L'assunzione del tasso di abbandono annuo del servizio OCS e Vending nello scenario di partenza. È la misura ipotetica di quanto valore, oggi, sfugge dalle radici.",
    feeds: ["m18", "m21"],
  },
  {
    key: "churnB",
    label: "Abbandono con welfare attivo",
    unit: "%",
    min: 0,
    max: 30,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.churnRateToBe * 100), // 2%
    group: "commerciale",
    weight: 0.75,
    concept:
      "Il tasso di abbandono quando il welfare aziendale è attivo: disdire il servizio significherebbe togliere un benefit ai dipendenti, e questo migliora la stabilità della relazione con i clienti.",
    feeds: ["m18", "m21"],
  },
  {
    key: "prospect",
    label: "Generazione di richieste spontanee",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.nuoviProspectRate * 100), // 40%
    group: "commerciale",
    weight: 0.7,
    concept:
      "La quota di ambasciatori le cui segnalazioni fatte ad addetti di altre imprese non clienti diventano richieste spontanee: i dipendenti chiedono al proprio ufficio HR di attivare la convenzione.",
    feeds: ["m16", "m17"],
  },
  {
    key: "chiusura",
    label: "Tasso di chiusura dei contratti",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    def: Math.round(SCENARIO_REGIME_200.tassoChiusuraProspect * 100), // 28%
    group: "commerciale",
    weight: 0.7,
    concept:
      "Quante delle richieste generate dal passaparola diventano contratti firmati. Arrivano da richieste del personale stesso: sono i dipendenti che hanno conosciuto la misura da amici che suggeriscono l'opportunità di aderire.",
    feeds: ["m17", "m20"],
  },
  {
    key: "clv",
    label: "Customer Lifetime Value",
    unit: "€",
    min: 500,
    max: 15000,
    step: 50,
    def: 1500, // Scenario regionale prudenziale: 1.500 €
    group: "commerciale",
    weight: 0.9,
    concept:
      "Il valore medio della relazione di un cliente enterprise per il Gruppo Illiria. È il metro con cui si pesa ogni impresa trattenuta e ogni nuovo contratto firmato.",
    feeds: ["m19", "m20"],
  },
];

export const INPUT_BY_KEY: Record<InputKey, InputDef> = Object.fromEntries(
  INPUTS.map((d) => [d.key, d])
) as Record<InputKey, InputDef>;

/* ---------------- costanti invarianti (solo testo) ---------------- */

export const CONSTANTS_TEXT = [
  { label: "Buono soggiorno e agriturismo", value: `${INVARIANT_CONSTANTS.VOUCHER_HOTEL_EUR} euro a lavoratore` },
  { label: "Buono ristorazione e degustazione", value: `${INVARIANT_CONSTANTS.VOUCHER_FOOD_EUR} euro a lavoratore` },
  { label: "Scontrino medio del cesto a Km 0", value: `${INVARIANT_CONSTANTS.CESTO_KM0_EUR} euro a ordine` },
  { label: "Copertura biglietti spettacolo", value: `${INVARIANT_CONSTANTS.MATCHING_GRANT_TICKET_EUR} euro, interamente a carico della Startup` },
  { label: "Biglietti per beneficiario", value: "due: lavoratore più accompagnatore" },
  { label: "Moltiplicatore presenza a coppia", value: "due presenze per ciascun voucher (lavoratore + accompagnatore)" },
  { label: "Moltiplicatore della spesa sul territorio", value: "due euro e mezzo per ogni euro di buono" },
  { label: "Quota di beneficiari che attiva passaparola", value: "35% (motore di viralità referenziata)" },
  { label: "Inviti medi per ambasciatore", value: "sei persone" },
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
    label: "Acquirenti della filiera corta",
    area: "territoriale",
    branch: 1,
    fmt: "int",
    concept:
      "I dipendenti che ordinano i cesti di prodotti a Km 0: la domanda stabile che permette ai produttori di avere accesso al mercato direttamente dalla piattaforma di welfare.",
    origin: "Nasce dalla popolazione raggiunta nella misura dell'adesione all'acquisto di prodotti a Km 0.",
    roots: ["aziende", "dip", "km0"],
  },
  {
    id: "m8",
    label: "Consegne annue",
    area: "territoriale",
    branch: 1,
    fmt: "int",
    concept:
      "Gli ordini dell'anno, tutti trasportati con sinergie di scopo della flotta: i mezzi Illiria compiono già questi tragitti per rifornimenti verso OCS e distributori.",
    origin: "Nasce dagli acquirenti moltiplicati per gli ordini che ciascuno ripete in un anno.",
    roots: ["aziende", "dip", "km0", "freq"],
  },
  {
    id: "m9",
    label: "Fatturato della filiera",
    area: "territoriale",
    branch: 1,
    fmt: "eur",
    concept:
      "Il valore che arriva direttamente a produttori enogastronomici a Km 0: aziende agricole, botteghe e cantine locali: un nuovo mercato, senza le intermediazioni che superano dell'80% il valore aggiunto sul prezzo finale, senza costi di trasporto e ad impatto marginale per l'ambiente annullato.",
    origin: "Nasce dalle consegne annue valorizzate allo scontrino medio del cesto a Km 0.",
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
      "Le tonnellate di anidride carbonica che non entrano in atmosfera grazie ai passaggi condivisi: il dato che finisce nel dossier verde spendibile come fattore critico per la qualificazione dei contratti pubblici, nei Criteri Ambientali Minimi (CAM) e come vantaggio competitivo della responsabilità sociale territoriale nei contratti con gli enti pubblici.",
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
      "Il 35% dei beneficiari, al termine dell'esperienza, riceve il Certificato Welfare e Impatto e diventa promotore attivo presso colleghi di altre aziende.",
    origin: "Nasce dai beneficiari attivi: circa uno su tre (35%) si fa portavoce.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m14",
    label: "Inviti generati",
    area: "illiria",
    branch: 4,
    fmt: "int",
    concept:
      "Ogni ambasciatore invita in media sei persone (amici, partner, colleghi o familiari): è il passaparola organizzato che la piattaforma rende misurabile.",
    origin: "Nasce dagli ambasciatori moltiplicati per i sei inviti medi di ciascuno.",
    roots: ["aziende", "dip", "hotel", "aper"],
  },
  {
    id: "m15",
    label: "Indice di viralità",
    area: "illiria",
    branch: 4,
    fmt: "k",
    concept:
      "Il motore di crescita del modello: il passaparola strutturato diffonde la misura tra le imprese vicine del territorio. Un volano che gira da solo.",
    origin: "Nasce dalla quota di ambasciatori (35%), per gli inviti di ciascuno (6), per la conversione del passaparola.",
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
    concept:
      "Il fatturato mantenuto con l'abbandono evitato: ogni impresa trattenuta è stata stimata con il valore del Customer Lifetime Value.",
    origin: "Nasce dalle imprese trattenute valorizzate al Customer Lifetime Value.",
    roots: ["aziende", "churnA", "churnB", "clv"],
  },
  {
    id: "m20",
    label: "Valore Promotore",
    area: "illiria",
    branch: 4,
    fmt: "eur",
    concept:
      "Clienti salvati più clienti nuovi, valutati con il valore a vita (Customer Lifetime Value): è la risposta economica del modello, ottenuta a investimento monetario diretto nullo.",
    origin: "Nasce dalla somma di imprese trattenute e nuovi contratti, moltiplicata per il Customer Lifetime Value.",
    roots: ["aziende", "dip", "hotel", "aper", "prospect", "chiusura", "churnA", "churnB", "clv"],
  },
  {
    id: "m21",
    label: "Riduzione dell'abbandono",
    area: "illiria",
    branch: 4,
    fmt: "pct",
    concept:
      "Di quanto si riduce il tasso di abbandono: da una media di settore ipotizzata del 10% per un prodotto facilmente sostituibile al 2% dei servizi con attributi basati sulla componente fiducia.",
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
      "Le imprese clienti finanziano buoni da 50 euro per soggiorni in hotel e agriturismi e da 25 euro per aperitivi tipici e ristorazione, attingendo interamente a budget del Flexible Benefit. La piattaforma della Startup emette, valida, predispone la conformità normativa e amministrativa con documentazione automatizzata dei buoni in digitale, senza carta né rimborsi.",
    ritorno:
      "Illiria siede al tavolo della Direzione HR e dell'Amministratore Delegato come abilitatore del welfare, superando la logica di commodity legata al prezzo della cialda.",
  },
  {
    id: 1,
    title: "Filiera Corta a emissioni aggiuntive nulle",
    tag: "Logistica condivisa",
    concept:
      "I dipendenti ordinano cesti di prodotti locali via piattaforma. La flotta consegna senza alcuna variazione del percorso pianificato per il rifornimento OCS o distributori, ritirandoli presso uno o due punti di raccolta lungo il tragitto e li consegnano sul posto di lavoro. Nessun kilometro extra: costo di trasporto azzerato per i produttori ed emissioni dedicate annullate. L'impatto ambientale marginale è di fatto zero. Uno dei rari casi in cui significativa riduzione delle emissioni e comunicazione ambientale hanno alta risonanza senza dubbi di greenwashing.",
    ritorno:
      "E' utilizzabile in svariate attività: dall'ufficio stampa alla comunicazione integrata di marketing sociale, incluse attività per la presentazione di offerte per la partecipazione a bandi di gara pubblici e privati.",
  },
  {
    id: 2,
    title: "Fondo biglietti, Matching Grant e Ospitalità locale",
    tag: "Leva della Startup",
    concept:
      "La Startup copre interamente i biglietti di spettacoli ed eventi culturali, venticinque euro per il dipendente e per il suo accompagnatore. Il biglietto è abbinato al valore di ogni Voucher di Welfare Aziendale erogato per soggiorno e ristorazione: il soggiorno sul territorio avviene a costi accessibili e traina una spesa accessoria che moltiplica il valore per due e mezzo.",
    ritorno:
      "Visibilità e co-branding per Gruppo Illiria come promotore dell'esperienza culturale nel tempo libero dei lavoratori.",
  },
  {
    id: 3,
    title: "Cultura, spettacolo e rendicontazione CSR ",
    tag: "Impatto certificato",
    concept:
      "Ogni evento è una rassegna di sei o otto spettacoli in comuni diversi: retribuisce in media venti artisti e attrae circa mille spettatori aggiuntivi rispetto ai beneficiari di Welfare aziendale con campagne di advertising. Le imprese coinvolte nel programma hanno la visibilità creata dagli sponsor che finanziano il budget media per la campagne. In questo modo anche le piccole imprese possono dare risalto ai risultati che spesso prevedono budget media elevati difficili da sostenere. La Startup le supporta negli schemi volontari della CSRD di EFRAG o con l'Integrated Reporting <IR> dell'IFRS Sustainability Disclosure Standards.",
    ritorno:
      "Risorse e materaili per atttività PR e CSR congiunta, con casi operativi documentati a supporto delle relazioni istituzionali e della rete commerciale.",
  },
  {
    id: 4,
    title: "Passaparola dei lavoratori e fedeltà dei clienti",
    tag: "Motore di crescita",
    concept:
      "Al termine dell'esperienza il dipendente riceve il Certificato Welfare e Impatto e invita i colleghi di altre aziende a chiedere al proprio ufficio HR l'attivazione della convenzione. Le direzioni HR ricevono richieste spontanee dal basso. Disdire il servizio OCS o distributori significherebbe revocare il benefit ai dipendenti: una barriera all'uscita che protegge il portafoglio.",
    ritorno:
      "Contattti con potenziali nuovi clienti enterprise e fidelizzazione del portafoglio esistente: il churn rate si riduce perché i dipendenti non vogliono perdere i benefici derivati dal programma.",
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
      "Portafoglio clienti, autorevolezza di un impresa storica e logistica dell'ultimo miglio. Accoglie nel proprio portafoglio la partnership della startup per generare valore condiviso in Aree Interne.",
    gets:
      "Rafforzamento della forza negoziale con i clienti, documenti tecnici CSRD valevoli nei contratti pubblici, go to market facilitato per coinvolgere grandi imprese, fidelizzazione dei clienti attuali, estensione del posizionamento competitivo attento al territorio e alle persone, forte differenziazione dai competitors.",
    highlight: true,
    badge: "Investimento monetario: non necessario",
  },
  {
    name: "Startup Attuatore",
    role: "Attuatore e gestione operativa",
    gives:
      "Piattaforma tecnologica di welfare territoriale, fondo Matching Grant per il raddoppio dei voucher con biglietti omaggio a coppie, 3 FTE dedicati a proprio carico per il supporto operativo e fiscale chiavi in mano alle PMI clienti.",
    gets: "Sviluppo di partenariati pubblico-privati orientati allo Shared Value per le Aree Interne, dove l'innovazione di modello genera valore condiviso, coesione e ricadute misurabili.",
  },
  {
    name: "Imprese clienti",
    role: "Finanziatrici del welfare",
    gives: "Budget per addetti, deducibili fiscalmente, destinati al welfare dei propri dipendenti, senza nessun altro costo aggiuntivo per ogni altra attività prevista.",
    gets:
      "Promotori di un alto impatto locale condiviso con risorse economiche irrilevanti, dipendenti più soddisfatti dell'azienda, tool web e martech per la visibilità, supporto all'adozione dei benefici del welfare aziendale, all'integrazione di strategie di RSI, diffussione di Best Practice aziendali.",
  },
  {
    name: "Lavoratori",
    role: "Fruitori e ambasciatori",
    gives: "Adesione al servizio, partecipazione alle esperienze e passaparola verso amici e colleghi di altre aziende, diffusione e promozione del Certificato del Welfare ad Impatto locale.",
    gets: "Raddoppio del valore del Voucher di welfare con Biglietti in omaggio per due persone, maggiore potere d'acquisto per beni di qualità a km 0 senza muoversi da casa; più esperienze ricreative e culturali sul proprio territorio, gratificazione di sentirsi parte attiva nella coesione locale.",
  },
  {
    name: "Ecosistema territoriale",
    role: "Rete dell'offerta",
    gives: "Fiducia, collaborazione e adesione al programma tra atttività generalmente sconnesse: produttori agricoli, hotel e agriturismi, ristorazione, artisti e compagnie di spettacolo.",
    gets: "Generazione di domanda turistica e commerciale aggiuntiva, ricorrente e programmabile in Aree Interne con problemi di spopolamento e marginalità economica; utilizzo gratuito del set di tecnologie digitali; visibilità e maggiori opportunità per artisti emergenti dello spettacolo dal vivo.",
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
  const amb = seed * 0.35;
  const inviti = amb * 6;
  const kf = 0.35 * 6 * 0.35;
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
    id: "pilota-prudenziale",
    label: "Scenario pilota prudenziale",
    note: "Avvio su perimetro ridotto (100 aziende x 25 dip) con adozioni caute e CLV 1.500 €",
    values: {
      aziende: 100,
      dip: 25,
      hotel: 15,
      aper: 15,
      km0: 10,
      freq: 3,
      km: 30,
      churnA: 10,
      churnB: 2,
      prospect: 20,
      chiusura: 20,
      clv: 1500,
    },
  },
  {
    id: "pilota-base",
    label: "Scenario pilota base",
    note: "150 aziende, 4.500 addetti, adozioni 16% hotel, 25% food, 20% Km 0 con 6 ordini annui e CLV 2.500 €",
    values: {
      aziende: SCENARIO_PILOTA_150.aziende,
      dip: SCENARIO_PILOTA_150.dipendentiPerAzienda,
      hotel: Math.round(SCENARIO_PILOTA_150.tassoAdesioneHotel * 100),
      aper: Math.round(SCENARIO_PILOTA_150.tassoAdesioneFood * 100),
      km0: Math.round(SCENARIO_PILOTA_150.tassoAdozioneKm0 * 100),
      freq: SCENARIO_PILOTA_150.frequenzaAcquistiKm0,
      km: SCENARIO_PILOTA_150.trattaLogisticaEvitataKm,
      churnA: 10,
      churnB: 2,
      prospect: Math.round(SCENARIO_PILOTA_150.nuoviProspectRate * 100),
      chiusura: Math.round(SCENARIO_PILOTA_150.tassoChiusuraProspect * 100),
      clv: 2500,
    },
  },
  {
    id: "regionale-prudenziale",
    label: "Scenario regionale prudenziale",
    note: "200 aziende, 8.000 addetti, adozioni 22% hotel, 32% food, 20% Km 0 con 6 riordini e CLV 1.500 € (Scenario ufficiale)",
    values: DEF_INPUTS,
  },
  {
    id: "regionale-base",
    label: "Scenario regionale base",
    note: "250 aziende x 35 dip, adozioni elevate su tutta la regione e CLV 2.500 €",
    values: {
      aziende: 250,
      dip: 35,
      hotel: 25,
      aper: 35,
      km0: 35,
      freq: 10,
      km: 60,
      churnA: 10,
      churnB: 2,
      prospect: 45,
      chiusura: 30,
      clv: 2500,
    },
  },
];
