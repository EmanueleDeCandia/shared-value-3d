import { INVARIANT_CONSTANTS } from "./constants";
import { SCENARIO_REGIME_200 } from "./scenarios";
/**
 * Calcola l'impatto macro-sistemico su base scenario (popolazione aggregata, Aree Interne, filiera).
 * Implementa il modello ufficiale validato su 3.520 presenze a coppie nei borghi, moltiplicatore 2,408× Tor Vergata
 * e filiera Km 0 (288.000 €) aggiunta a saldo.
 */
export function calculateMacroImpact(scenario = SCENARIO_REGIME_200) {
    const popolazione = Math.round(scenario.aziende * scenario.dipendentiPerAzienda);
    // 1. Ricettività nei Borghi (Coorte ufficiale presenze a coppia = 3.520 presenze)
    const beneficiariHotel = Math.round(popolazione * scenario.tassoAdesioneHotel);
    const presenzeHotel = beneficiariHotel * INVARIANT_CONSTANTS.MOLTIPLICATORE_PRESENZE_HOTEL;
    const baseVoucherHotel = beneficiariHotel * INVARIANT_CONSTANTS.VOUCHER_HOTEL_EUR;
    const spesaEstesaHotel = presenzeHotel * INVARIANT_CONSTANTS.VOUCHER_HOTEL_EUR;
    // 2. Ristorazione tipica
    const beneficiariFood = Math.round(popolazione * scenario.tassoAdesioneFood);
    const presenzeFood = beneficiariFood * INVARIANT_CONSTANTS.MOLTIPLICATORE_PRESENZE_FOOD;
    const baseVoucherFood = beneficiariFood * INVARIANT_CONSTANTS.VOUCHER_FOOD_EUR;
    const spesaEstesaFood = presenzeFood * INVARIANT_CONSTANTS.VOUCHER_FOOD_EUR;
    // 3. Matching Grant Culturale
    const beneficiariCultura = beneficiariHotel; // abbinati ai soggiorni
    const bigliettiSpettacolo = beneficiariCultura * INVARIANT_CONSTANTS.TICKETS_PER_BENEFICIARY;
    const matchingGrantCultura = beneficiariCultura * INVARIANT_CONSTANTS.MATCHING_GRANT_TICKET_EUR;
    // 4. Filiera Corta Km 0 (aggiunta solo a saldo, esclusa dal moltiplicatore turistico)
    const acquirentiKm0 = Math.round(popolazione * scenario.tassoAdozioneKm0);
    const ordiniTotaliKm0 = acquirentiKm0 * scenario.frequenzaAcquistiKm0;
    const fatturatoKm0 = ordiniTotaliKm0 * scenario.scontrinoMedioKm0;
    // 5. Calcoli Ufficiali sul Modello Soggiorni Borghi a Coppie (3.520 presenze)
    const spesaMonetizzataWelfarePresenze = presenzeHotel * INVARIANT_CONSTANTS.WELFARE_MONETIZZATO_SOGGIORNO_EUR; // 264.000 €
    const spesaVivaNonMonetizzataPresenze = Math.round(presenzeHotel * INVARIANT_CONSTANTS.SPESA_VIVA_NON_MONETIZZATA_BORGHI_EUR * 100) / 100; // 300.924,80 €
    const baseDirettaPresenzeBorghi = Math.round(presenzeHotel * INVARIANT_CONSTANTS.BASE_DIRETTA_TOTALE_BORGHI_EUR * 100) / 100; // 564.924,80 €
    // Moltiplicatore Tor Vergata: +140,8% quota indotta non diretta
    const impattoIndottoTorVergata = Math.round(baseDirettaPresenzeBorghi * INVARIANT_CONSTANTS.MOLTIPLICATORE_NON_DIRETTO_TOR_VERGATA * 100) / 100; // 795.238,40 €
    // Impatto totale turismo borghi (2,408×)
    const impattoTurismoTotale = Math.round(baseDirettaPresenzeBorghi * INVARIANT_CONSTANTS.MOLTIPLICATORE_SISTEMA_TOR_VERGATA_ESATTO * 100) / 100; // 1.360.163,20 €
    // Valori monetizzabili diretti complessivi
    const valoreMonetizzabilePrudenziale = baseVoucherHotel + baseVoucherFood + matchingGrantCultura + fatturatoKm0;
    const valoreMonetizzabileEsteso = Math.round(baseDirettaPresenzeBorghi + fatturatoKm0); // 852.925 €
    const valoreMonetizzabileProCapite = popolazione > 0 ? valoreMonetizzabileEsteso / popolazione : 0;
    // Valore Indotto Tor Vergata (+140,8%) e Valore Complessivo di Sistema
    const valoreIntangibile = Math.round(impattoIndottoTorVergata);
    const valoreComplessivoSistema = Math.round(impattoTurismoTotale + fatturatoKm0); // 1.648.163 €
    const levaSroi = Math.round((valoreComplessivoSistema / INVARIANT_CONSTANTS.COSTO_RU_PROMOTORI_ANNUO_EUR) * 100) / 100; // 16.48
    // Ambientale
    const kmLogisticaEvitati = ordiniTotaliKm0 * scenario.trattaLogisticaEvitataKm;
    const emissioniCO2EvitateKg = kmLogisticaEvitati * INVARIANT_CONSTANTS.FATTORE_EMISSIONI_CO2_KG_KM;
    const emissioniCO2EvitateTonnellate = emissioniCO2EvitateKg / 1000;
    // Commerciale & Anti-Churn
    const deltaChurn = Math.max(0, scenario.churnRateAsIs - scenario.churnRateToBe);
    const impreseSalvate = scenario.aziende * deltaChurn;
    const seedViralita = popolazione * Math.max(scenario.tassoAdesioneHotel, scenario.tassoAdesioneFood);
    const ambasciatori = seedViralita * scenario.referralRate;
    const prospectSpontanei = ambasciatori * scenario.nuoviProspectRate;
    const nuoviContratti = prospectSpontanei * scenario.tassoChiusuraProspect;
    const valoreCommercialeTotale = (impreseSalvate + nuoviContratti) * scenario.clv;
    return {
        popolazione,
        beneficiariHotel,
        presenzeHotel,
        baseVoucherHotel,
        spesaEstesaHotel,
        beneficiariFood,
        presenzeFood,
        baseVoucherFood,
        spesaEstesaFood,
        beneficiariCultura,
        bigliettiSpettacolo,
        matchingGrantCultura,
        acquirentiKm0,
        ordiniTotaliKm0,
        fatturatoKm0,
        spesaMonetizzataWelfarePresenze,
        spesaVivaNonMonetizzataPresenze,
        baseDirettaPresenzeBorghi,
        impattoIndottoTorVergata,
        impattoTurismoTotale,
        valoreMonetizzabilePrudenziale,
        valoreMonetizzabileEsteso,
        valoreMonetizzabileProCapite,
        valoreIntangibile,
        valoreComplessivoSistema,
        levaSroi,
        kmLogisticaEvitati,
        emissioniCO2EvitateKg,
        emissioniCO2EvitateTonnellate,
        impreseSalvate,
        nuoviContratti,
        valoreCommercialeTotale,
    };
}
/**
 * Calcolo dedicato al simulatore singola azienda cliente (usato nelle landing page e per le trattative B2B).
 * Rispecchia esattamente i coefficienti del modello a regime 200 imprese (79,50 €/persona impatto monetizzabile esteso, 20% adozione Km 0 con 6 ordini/anno da 30 €).
 */
export function calculateCompanySimulator(people = 40, budgetPerPerson = 79.5) {
    const budgetTotale = Math.round(people * budgetPerPerson);
    const soggiorni = Math.round(people * SCENARIO_REGIME_200.tassoAdesioneHotel); // 22%
    const valoreSoggiorni = soggiorni * INVARIANT_CONSTANTS.VOUCHER_HOTEL_EUR;
    const spesaIndottaSecondaGiornata = soggiorni * INVARIANT_CONSTANTS.SPESA_INDOTTA_SECONDA_GIORNATA_EUR;
    const ristorazione = Math.round(people * SCENARIO_REGIME_200.tassoAdesioneFood); // 32%
    const valoreRistorazione = ristorazione * INVARIANT_CONSTANTS.VOUCHER_FOOD_EUR;
    const matchingCultura = soggiorni; // 22% abbinati ai soggiorni
    const valoreMatching = matchingCultura * INVARIANT_CONSTANTS.MATCHING_GRANT_TICKET_EUR;
    const acquirentiKm0 = Math.round(people * SCENARIO_REGIME_200.tassoAdozioneKm0); // 20% (riservato ai beneficiari dei voucher)
    const ordiniTotaliKm0 = acquirentiKm0 * SCENARIO_REGIME_200.frequenzaAcquistiKm0; // 6 all'anno
    const valoreKm0PerSingoloOrdine = acquirentiKm0 * INVARIANT_CONSTANTS.CESTO_KM0_EUR; // 30 € per consegna
    const valoreKm0Annuale = ordiniTotaliKm0 * INVARIANT_CONSTANTS.CESTO_KM0_EUR;
    // Componente turismo e soggiorni nei borghi a coppie (160,49 € per presenza, di cui 75 € welfare + 85,49 € Santagata)
    const presenze = soggiorni * INVARIANT_CONSTANTS.MOLTIPLICATORE_PRESENZE_HOTEL;
    const baseDirettaTurismo = Math.round(presenze * INVARIANT_CONSTANTS.BASE_DIRETTA_TOTALE_BORGHI_EUR);
    // Quota indotta non diretta dal moltiplicatore Tor Vergata (+140,8%)
    const valoreIntangibile = Math.round(baseDirettaTurismo * INVARIANT_CONSTANTS.MOLTIPLICATORE_NON_DIRETTO_TOR_VERGATA);
    const totaleTurismo = Math.round(baseDirettaTurismo * INVARIANT_CONSTANTS.MOLTIPLICATORE_SISTEMA_TOR_VERGATA_ESATTO);
    // Il valore dei prodotti a Km 0 va SOLO AGGIUNTO alla somma totale (senza moltiplicatore)
    const impattoDiretto = baseDirettaTurismo + valoreKm0Annuale;
    const valoreComplessivo = totaleTurismo + valoreKm0Annuale;
    const nettoBusta = Math.round(budgetTotale * INVARIANT_CONSTANTS.COEFFICIENTE_NETTO_BUSTA);
    const costoAziendaBusta = Math.round(budgetTotale * INVARIANT_CONSTANTS.COEFFICIENTE_COSTO_AZIENDA_BUSTA);
    return {
        people,
        budgetPerPerson,
        budgetTotale,
        soggiorni,
        valoreSoggiorni,
        spesaIndottaSecondaGiornata,
        ristorazione,
        valoreRistorazione,
        matchingCultura,
        valoreMatching,
        acquirentiKm0,
        ordiniKm0: acquirentiKm0,
        ordiniTotaliKm0,
        valoreKm0: valoreKm0PerSingoloOrdine,
        valoreKm0PerSingoloOrdine,
        valoreKm0Annuale,
        impattoDiretto,
        valoreIntangibile,
        valoreComplessivo,
        nettoBusta,
        costoAziendaBusta,
    };
}
/** Formatta un valore in Euro con stile italiano */
export function formatEur(n, decimals = 0) {
    return n.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: decimals,
    });
}
/**
 * Calcola l'impatto di Welfare Territoriale unificando le evidenze di spesa viva (Fondazione Santagata)
 * e il moltiplicatore econometrico macro (Fondazione Tor Vergata: 2,40x al posto del forfettario 2x).
 */
export function calculateWelfareTerritorialeImpact() {
    const welfareMonetizzato = INVARIANT_CONSTANTS.WELFARE_MONETIZZATO_SOGGIORNO_EUR;
    const spesaVivaNonMonetizzata = INVARIANT_CONSTANTS.SPESA_VIVA_NON_MONETIZZATA_BORGHI_EUR;
    const baseDirettaTotale = INVARIANT_CONSTANTS.BASE_DIRETTA_TOTALE_BORGHI_EUR;
    const moltiplicatoreSistema = INVARIANT_CONSTANTS.MOLTIPLICATORE_SISTEMA_TOR_VERGATA;
    const impattoNonDiretto = Math.round(baseDirettaTotale * INVARIANT_CONSTANTS.MOLTIPLICATORE_NON_DIRETTO_TOR_VERGATA * 100) / 100;
    const impattoTotaleSistema = Math.round(baseDirettaTotale * INVARIANT_CONSTANTS.MOLTIPLICATORE_SISTEMA_TOR_VERGATA_ESATTO * 100) / 100;
    const moltiplicatoreLevaDiretta = INVARIANT_CONSTANTS.MOLTIPLICATORE_LEVA_DIRETTA_WELFARE;
    const moltiplicatoreLevaWelfare = INVARIANT_CONSTANTS.MOLTIPLICATORE_LEVA_SISTEMICA_WELFARE;
    return {
        welfareMonetizzato,
        spesaVivaNonMonetizzata,
        baseDirettaTotale,
        moltiplicatoreSistema,
        impattoNonDiretto,
        impattoTotaleSistema,
        moltiplicatoreLevaDiretta,
        moltiplicatoreLevaWelfare,
    };
}
//# sourceMappingURL=calculations.js.map