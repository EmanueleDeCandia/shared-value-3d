import { INVARIANT_CONSTANTS } from "./constants";

export interface WelfareScenario {
  id: string;
  name: string;
  description: string;

  /** Numero imprese clienti/partner aderenti */
  aziende: number;

  /** Numero medio di dipendenti per impresa */
  dipendentiPerAzienda: number;

  /** Tasso di adesione al voucher soggiorno/hotel (0..1) */
  tassoAdesioneHotel: number;

  /** Tasso di adesione al voucher ristorazione/food (0..1) */
  tassoAdesioneFood: number;

  /** Tasso di adozione dello store prodotti a Km 0 (0..1) */
  tassoAdozioneKm0: number;

  /** Frequenza annuale media di acquisto cesti a Km 0 (ordini/anno per lavoratore attivo) */
  frequenzaAcquistiKm0: number;

  /** Scontrino medio d'acquisto cesto a Km 0 (€) */
  scontrinoMedioKm0: number;

  /** Tratta media evitata per consegna (km) */
  trattaLogisticaEvitataKm: number;

  /** Tasso di abbandono annuo as-is senza welfare (0..1) */
  churnRateAsIs: number;

  /** Tasso di abbandono to-be con welfare attivo (0..1) */
  churnRateToBe: number;

  /** Tasso di generazione nuovi prospect spontanei da passaparola (0..1) */
  nuoviProspectRate: number;

  /** Tasso di chiusura contratti sui prospect spontanei (0..1) */
  tassoChiusuraProspect: number;

  /** Customer Lifetime Value medio cliente enterprise (€) */
  clv: number;

  /** Tasso di beneficiari che attivano inviti referral (0..1) */
  referralRate: number;

  /** Numero medio di inviti inviati per ambasciatore */
  invitiMediPerAmbassador: number;

  /** Tasso di conversione degli inviti referral (0..1) */
  conversionRate: number;
}

/**
 * SCENARIO TARGET A REGIME (200 IMPRESE / 8.000 LAVORATORI)
 * Modello matematico consolidato utilizzato nelle Card di Reporting ESG,
 * in Assunzioni.md e nella Landing Page di welfare territoriale.
 */
export const SCENARIO_REGIME_200: WelfareScenario = {
  id: "regionale-prudenziale",
  name: "Scenario regionale prudenziale (Target a Regime - 200 Imprese)",
  description:
    "Intervento a pieno regime su 200 imprese partner dell'Area Interna (8.000 lavoratori complessivi). Tassi di fruizione effettivi: 22% hotel, 32% ristorazione, 20% Km 0 con 6 riordini annui (9.600 panieri a 30 € per 288.000 € di filiera). Riservato ai beneficiari dei voucher welfare aziendali. Corrisponde allo Scenario ufficiale unico adottato per il Reporting ESG delle imprese clienti.",
  aziende: 200,
  dipendentiPerAzienda: 40,
  tassoAdesioneHotel: 0.22,
  tassoAdesioneFood: 0.32,
  tassoAdozioneKm0: 0.20,
  frequenzaAcquistiKm0: 6,
  scontrinoMedioKm0: INVARIANT_CONSTANTS.CESTO_KM0_EUR, // 30 €
  trattaLogisticaEvitataKm: INVARIANT_CONSTANTS.TRATTA_LOGISTICA_EVITATA_KM, // 50 km
  churnRateAsIs: 0.10,
  churnRateToBe: 0.02,
  nuoviProspectRate: 0.40,
  tassoChiusuraProspect: 0.28,
  clv: 1500,
  referralRate: 0.35,
  invitiMediPerAmbassador: 6,
  conversionRate: 0.35,
};

/** Alias esplicito per chiarezza tra i due siti: coincide con SCENARIO_REGIME_200 */
export const SCENARIO_REGIONALE_PRUDENZIALE = SCENARIO_REGIME_200;

/**
 * SCENARIO PILOTA INIZIALE (150 IMPRESE / 4.500 LAVORATORI)
 * Scenario prudenziale originario di avvio su perimetro ridotto.
 */
export const SCENARIO_PILOTA_150: WelfareScenario = {
  id: "pilota-150",
  name: "Pilota Iniziale (150 Imprese)",
  description:
    "Scenario di avvio prudenziale su 150 PMI del portafoglio (4.500 addetti). Tassi di fruizione caute: 16% hotel, 25% food, 20% Km 0 con 6 ordini annui.",
  aziende: 150,
  dipendentiPerAzienda: 30,
  tassoAdesioneHotel: 0.16,
  tassoAdesioneFood: 0.25,
  tassoAdozioneKm0: 0.20,
  frequenzaAcquistiKm0: 6,
  scontrinoMedioKm0: INVARIANT_CONSTANTS.CESTO_KM0_EUR, // 30 €
  trattaLogisticaEvitataKm: INVARIANT_CONSTANTS.TRATTA_LOGISTICA_EVITATA_KM, // 50 km
  churnRateAsIs: 0.10,
  churnRateToBe: 0.02,
  nuoviProspectRate: 0.30,
  tassoChiusuraProspect: 0.20,
  clv: 1250,
  referralRate: 0.25,
  invitiMediPerAmbassador: 5,
  conversionRate: 0.25,
};

export const ALL_SCENARIOS: Record<string, WelfareScenario> = {
  "regime-200": SCENARIO_REGIME_200,
  "pilota-150": SCENARIO_PILOTA_150,
};

/** Scenario predefinito ufficiale di sistema */
export const DEFAULT_SCENARIO: WelfareScenario = SCENARIO_REGIME_200;
