/**
 * Costanti invarianti del modello di Welfare Aziendale Territoriale & Shared Value.
 * Fonte: Assunzioni.md, accordi di rete Gruppo Illiria, Startup Innovativa, D.Lgs TUIR art. 51.
 */

export const INVARIANT_CONSTANTS = {
  /** Valore nominale del Voucher Soggiorno Borghi (deducibile TUIR art. 51) */
  VOUCHER_HOTEL_EUR: 50,

  /** Valore nominale del Voucher Ristorazione ed Enogastronomia locale */
  VOUCHER_FOOD_EUR: 25,

  /** Scontrino medio d'acquisto per paniere/cesto di prodotti agricoli a Km 0 */
  CESTO_KM0_EUR: 30,

  /** Quota standard di adozione dello store prodotti Km 0 (20% della popolazione, riservata ai beneficiari voucher) */
  TASSO_ADOZIONE_KM0_DEFAULT: 0.20,

  /** Frequenza standard di ordini annui di cesti Km 0 per acquirente attivo (cadenza ogni due mesi) */
  FREQUENZA_ORDINI_KM0_DEFAULT: 6,

  /** Valore del biglietto spettacolo coperto al 100% dal fondo della Startup (Matching Grant) */
  MATCHING_GRANT_TICKET_EUR: 25,

  /** Numero di biglietti omaggio per beneficiario attivo (dipendente + accompagnatore) */
  TICKETS_PER_BENEFICIARY: 2,

  /** Moltiplicatore presenze turistiche (lavoratore viaggia in coppia / seconda notte) */
  MOLTIPLICATORE_PRESENZE_HOTEL: 2,

  /** Moltiplicatore presenze a tavola (esperienza condivisa con accompagnatore) */
  MOLTIPLICATORE_PRESENZE_FOOD: 2,

  /** Spesa indotta per pernottamento nella seconda giornata trascorsa nel borgo (€) */
  SPESA_INDOTTA_SECONDA_GIORNATA_EUR: 100,

  /** Tratta media di trasporto evitata per ciascuna consegna di panieri grazie alla flotta ordinaria (km) */
  TRATTA_LOGISTICA_EVITATA_KM: 50,

  /** Fattore standard emissivo trasporto commerciale leggero diesel/ibrido (kg CO2 / km) */
  FATTORE_EMISSIONI_CO2_KG_KM: 0.19,

  /** Moltiplicatore dell'impatto intangibile non monetizzabile su quello monetizzabile diretto (Rapporto 2x storico) */
  MOLTIPLICATORE_VALORE_INTANGIBILE: 2.0,

  /** Moltiplicatore della spesa indotta territoriale sul budget complessivo voucher (Rapporto 2,5x) */
  MOLTIPLICATORE_INDOTTO_TERRITORIALE: 2.5,

  /**
   * Moltiplicatore macroeconomico di sistema (Fonte: Studio Econometrico Fondazione Tor Vergata).
   * Rapporto tra impatto totale di sistema (379,356 Mld €) ed effetto diretto (157,56 Mld €):
   * 240,8% (rapporto 2,408× ≈ 2,40×). Sostituisce il moltiplicatore forfettario 2×.
   */
  MOLTIPLICATORE_SISTEMA_TOR_VERGATA: 2.40,
  MOLTIPLICATORE_SISTEMA_TOR_VERGATA_ESATTO: 2.4077,

  /** Moltiplicatore dell'impatto non diretto addizionale (Tor Vergata: +140,8% della spesa diretta) */
  MOLTIPLICATORE_NON_DIRETTO_TOR_VERGATA: 1.4077,

  /** Quota monetizzata dal welfare aziendale per soggiorno nei borghi: Hotel (50 €) + Aperitivo-Cena (25 €) */
  WELFARE_MONETIZZATO_SOGGIORNO_EUR: 75,

  /** Spesa viva territoriale addizionale non monetizzata (Fonte: Fondazione Santagata - Totale Meno Alloggio) */
  SPESA_VIVA_NON_MONETIZZATA_BORGHI_EUR: 85.49,

  /** Base di spesa diretta reale pro capite attivata nei borghi (75 € monetizzati + 85,49 € non monetizzati = 160,49 €) */
  BASE_DIRETTA_TOTALE_BORGHI_EUR: 160.49,

  /** Moltiplicatore di leva della spesa diretta sul welfare monetizzato (160,49 € / 75 € = 2,14x) */
  MOLTIPLICATORE_LEVA_DIRETTA_WELFARE: 2.14,

  /**
   * Moltiplicatore di leva complessiva (x) attivato dai 75 € di spesa welfare sul territorio:
   * (160,49 € × 2,4077) / 75 € = 386,41 € / 75 € = 5,15× (515% di impatto sistemico per euro di welfare).
   */
  MOLTIPLICATORE_LEVA_SISTEMICA_WELFARE: 5.15,

  /** Coefficiente netto in busta paga rispetto al lordo aziendale (cuneo fiscale indicativo ~66%) */
  COEFFICIENTE_NETTO_BUSTA: 0.66,

  /** Coefficiente costo azienda in busta paga comprensivo di oneri contributivi (~132%) */
  COEFFICIENTE_COSTO_AZIENDA_BUSTA: 1.32,

  /** Numero presenze complessive a regime borghi (Scenario ufficiale a coppie: 1.760 beneficiari × 2) */
  PRESENZE_REGIME_BORGHI_COPPIE: 3520,

  /** Base di spesa diretta reale per l'intera coorte di 3.520 presenze (3.520 × 160,49 € = 564.924,80 €) */
  BASE_DIRETTA_REGIME_BORGHI_EUR: 564924.8,

  /** Quota indotta non diretta generata dal moltiplicatore Tor Vergata a regime (564.924,80 × 1,4077 = 795.238,40 €) */
  INDOTTO_TOR_VERGATA_REGIME_EUR: 795238.4,

  /** Impatto totale turismo borghi a regime (564.924,80 × 2,4077 = 1.360.163,20 €) */
  IMPATTO_TURISMO_REGIME_EUR: 1360163.2,

  /** Fatturato filiera corta Km 0 a regime (1.600 acquirenti × 6 ordini × 30 € = 288.000 € / anno, aggiunto a saldo) */
  FATTURATO_KM0_REGIME_EUR: 288000,

  /** Valore complessivo territoriale di sistema a regime (1.360.163,20 € + 288.000 € = 1.648.163,20 €) */
  VALORE_COMPLESSIVO_SISTEMA_REGIME_EUR: 1648163.2,

  /** Costo annuo risorse umane dedicate a carico dei Promotori (3 FTE Startup Attuatore) */
  COSTO_RU_PROMOTORI_ANNUO_EUR: 100000,

  /** Leva SROI di rendimento sociale netta a regime (1.648.163,20 € / 100.000 € = 16,48x) */
  LEVA_SROI_REGIME: 16.48,
} as const;

/**
 * URL ufficiali delle applicazioni connesse nell'ecosistema Shared Value
 */
export const APP_URLS = {
  /** Applicazione 3D / Stakeholder Illiria: Albero del Valore Condiviso */
  PRESENTATION_3D: "https://shared-value-898481966164.europe-west1.run.app",
  /** Landing Page B2B / Imprese Clienti: Welfare Territoriale & Valore Congiunto */
  CLIENTS_LANDING_PAGE: "https://shared-value-impact-898481966164.europe-west1.run.app",
} as const;
