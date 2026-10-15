import { WelfareScenario } from "./scenarios";
export interface MacroImpactOutputs {
    /** Popolazione lavorativa totale raggiunta */
    popolazione: number;
    /** Beneficiari che attivano voucher soggiorno */
    beneficiariHotel: number;
    /** Presenze turistiche totali generate (con moltiplicatore 2x) */
    presenzeHotel: number;
    /** Risorse transate base voucher hotel (€) */
    baseVoucherHotel: number;
    /** Spesa turistica estesa generata nei borghi (€) */
    spesaEstesaHotel: number;
    /** Beneficiari che attivano voucher food */
    beneficiariFood: number;
    /** Presenze a tavola totali generate (con moltiplicatore 2x) */
    presenzeFood: number;
    /** Risorse transate base voucher food (€) */
    baseVoucherFood: number;
    /** Spesa ristorativa estesa generata nei locali (€) */
    spesaEstesaFood: number;
    /** Beneficiari cultura / matching grant */
    beneficiariCultura: number;
    /** Biglietti spettacolo omaggio emessi */
    bigliettiSpettacolo: number;
    /** Risorse immesse in cultura dal Matching Grant (€) */
    matchingGrantCultura: number;
    /** Lavoratori che acquistano prodotti a Km 0 */
    acquirentiKm0: number;
    /** Numero totale consegne/panieri all'anno */
    ordiniTotaliKm0: number;
    /** Fatturato riversato direttamente ai piccoli produttori agricoli (€) */
    fatturatoKm0: number;
    /** Valore Monetizzabile Diretto - Livello Prudenziale (€ / anno) */
    valoreMonetizzabilePrudenziale: number;
    /** Valore Monetizzabile Diretto - Livello Esteso (€ / anno) */
    valoreMonetizzabileEsteso: number;
    /** Flusso monetizzabile pro capite per lavoratore (€) */
    valoreMonetizzabileProCapite: number;
    /** Valore Non Monetizzabile / Indotto Tor Vergata (+140,8%: 795.238 € / anno) */
    valoreIntangibile: number;
    /** Valore Complessivo di Sistema generato (€ / anno: 1.648.163 €) */
    valoreComplessivoSistema: number;
    /** Spesa monetizzata innesco welfare su presenze a regime (€ 264.000) */
    spesaMonetizzataWelfarePresenze: number;
    /** Spesa viva non monetizzata giorno 2 nei borghi (€ 300.925) */
    spesaVivaNonMonetizzataPresenze: number;
    /** Base di spesa diretta reale nei borghi su presenze (€ 564.925) */
    baseDirettaPresenzeBorghi: number;
    /** Quota indotta non diretta Tor Vergata (+140,8%: € 795.238) */
    impattoIndottoTorVergata: number;
    /** Impatto totale turismo borghi Tor Vergata (2,408×: € 1.360.163) */
    impattoTurismoTotale: number;
    /** Leva SROI netta su 100k costi operativi promotori (16,48×) */
    levaSroi: number;
    /** Tratte di trasporto commerciale evitate (km) */
    kmLogisticaEvitati: number;
    /** Emissioni di CO2 evitate (kg) */
    emissioniCO2EvitateKg: number;
    /** Emissioni di CO2 evitate (tonnellate) */
    emissioniCO2EvitateTonnellate: number;
    /** Imprese clienti trattenute da effetto fidelizzazione */
    impreseSalvate: number;
    /** Nuovi contratti generati da passaparola spontaneo */
    nuoviContratti: number;
    /** Valore economico generato per la rete commerciale (€) */
    valoreCommercialeTotale: number;
}
/**
 * Calcola l'impatto macro-sistemico su base scenario (popolazione aggregata, Aree Interne, filiera).
 * Implementa il modello ufficiale validato su 3.520 presenze a coppie nei borghi, moltiplicatore 2,408× Tor Vergata
 * e filiera Km 0 (288.000 €) aggiunta a saldo.
 */
export declare function calculateMacroImpact(scenario?: WelfareScenario): MacroImpactOutputs;
export interface CompanySimulatorOutputs {
    people: number;
    budgetPerPerson: number;
    budgetTotale: number;
    soggiorni: number;
    valoreSoggiorni: number;
    spesaIndottaSecondaGiornata: number;
    ristorazione: number;
    valoreRistorazione: number;
    matchingCultura: number;
    valoreMatching: number;
    acquirentiKm0: number;
    /** Alias per compatibilità con i template UI */
    ordiniKm0: number;
    ordiniTotaliKm0: number;
    valoreKm0: number;
    valoreKm0PerSingoloOrdine: number;
    valoreKm0Annuale: number;
    impattoDiretto: number;
    valoreIntangibile: number;
    valoreComplessivo: number;
    nettoBusta: number;
    costoAziendaBusta: number;
}
/**
 * Calcolo dedicato al simulatore singola azienda cliente (usato nelle landing page e per le trattative B2B).
 * Rispecchia esattamente i coefficienti del modello a regime 200 imprese (79,50 €/persona impatto monetizzabile esteso, 20% adozione Km 0 con 6 ordini/anno da 30 €).
 */
export declare function calculateCompanySimulator(people?: number, budgetPerPerson?: number): CompanySimulatorOutputs;
/** Formatta un valore in Euro con stile italiano */
export declare function formatEur(n: number, decimals?: number): string;
export interface WelfareTerritorialeImpactOutputs {
    /** Quota welfare monetizzata (Hotel 50 € + Aperitivo/Cena 25 € = 75 €) */
    welfareMonetizzato: number;
    /** Spesa viva territoriale non monetizzata (Santagata: totale meno alloggio = 85,49 €) */
    spesaVivaNonMonetizzata: number;
    /** Base di spesa diretta complessiva (75 € + 85,49 € = 160,49 €) */
    baseDirettaTotale: number;
    /** Moltiplicatore validato di sistema (Tor Vergata: 2,408× ≈ 2,40×, che sostituisce il forfettario 2×) */
    moltiplicatoreSistema: number;
    /** Impatto non diretto pro capite (+140,8% = 225,92 €) */
    impattoNonDiretto: number;
    /** Impatto totale di sistema pro capite (386,41 €) */
    impattoTotaleSistema: number;
    /** Moltiplicatore di leva diretta su spesa welfare (160,49 € / 75 € = 2,14×) */
    moltiplicatoreLevaDiretta: number;
    /** Moltiplicatore di leva complessiva (x) attivato dai 75 € di welfare sul territorio (386,41 € / 75 € = 5,15×) */
    moltiplicatoreLevaWelfare: number;
}
/**
 * Calcola l'impatto di Welfare Territoriale unificando le evidenze di spesa viva (Fondazione Santagata)
 * e il moltiplicatore econometrico macro (Fondazione Tor Vergata: 2,40x al posto del forfettario 2x).
 */
export declare function calculateWelfareTerritorialeImpact(): WelfareTerritorialeImpactOutputs;
//# sourceMappingURL=calculations.d.ts.map