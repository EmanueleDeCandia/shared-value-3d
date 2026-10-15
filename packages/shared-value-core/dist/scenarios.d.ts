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
export declare const SCENARIO_REGIME_200: WelfareScenario;
/** Alias esplicito per chiarezza tra i due siti: coincide con SCENARIO_REGIME_200 */
export declare const SCENARIO_REGIONALE_PRUDENZIALE: WelfareScenario;
/**
 * SCENARIO PILOTA INIZIALE (150 IMPRESE / 4.500 LAVORATORI)
 * Scenario prudenziale originario di avvio su perimetro ridotto.
 */
export declare const SCENARIO_PILOTA_150: WelfareScenario;
export declare const ALL_SCENARIOS: Record<string, WelfareScenario>;
/** Scenario predefinito ufficiale di sistema */
export declare const DEFAULT_SCENARIO: WelfareScenario;
//# sourceMappingURL=scenarios.d.ts.map