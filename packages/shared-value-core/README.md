# Shared Value Core (`shared-value-core`)

> **Single Source of Truth (SSOT)** per il modello matematico, le costanti invarianti, gli scenari di adozione e le metriche di impatto del progetto **Shared Value & Welfare Aziendale Territoriale**.

Questo pacchetto centralizza i parametri condivisi tra le varie applicazioni del progetto:
1. `shared-value-web-presentation-qwen-3.8-max` (Presentazione interattiva 3D con Albero e Slider parametrici)
2. `welfare-landing-page-redesign-x-clienti-grok-4.6-high` (Landing Page B2B con Reporting ESG e Simulatore Impatto)

---

## 1. Scenario Ufficiale di Riferimento: `SCENARIO_REGIME_200` (`SCENARIO_REGIONALE_PRUDENZIALE`)

> **Corrispondenza tra i due siti:**
> Questo scenario corrisponde esattamente allo **"Scenario regionale prudenziale"** dell'Albero 3D (precedentemente denominato *Target a regime - Regionale minimo*).
> **È l'unico scenario fisso adottato per il Reporting ESG e per i dati ufficiali nella Landing Page Imprese Clienti** (`welfare-landing-page-redesign-x-clienti-grok-4.6-high`), garantendo piena coerenza matematica e narrativa.

Definito in `Assunzioni.md` e nelle Card di Reporting ESG:

| Parametro | Chiave | Valore Ufficiale | Note Operative |
| :--- | :--- | :--- | :--- |
| **Imprese Partner** | `aziende` | **200** | Rete delle imprese clienti convenzionate |
| **Dipendenti medi per impresa** | `dip` | **40** | Taglia media organico |
| **Popolazione complessiva ($P_{tot}$)** | $W$ | **8.000 addetti** | $200 \times 40$ |
| **Adozione Buono Soggiorno Borghi** | `hotel` | **22%** | $1.760$ beneficiari |
| **Valore facciale Voucher Hotel** | $V_{hotel}$ | **€ 50** | Deducibile ex art. 51 TUIR |
| **Moltiplicatore presenze hotel** | $M_{hotel}$ | **2×** | Viaggio in coppia / 2a notte ($3.520$ presenze) |
| **Adozione Voucher Ristorazione** | `food` | **32%** | $2.560$ beneficiari |
| **Valore facciale Voucher Food** | $V_{food}$ | **€ 25** | Degustazione / aperitivo tipico |
| **Moltiplicatore presenze food** | $M_{food}$ | **2×** | Esperienza condivisa ($5.120$ presenze a tavola) |
| **Matching Grant Culturale** | $V_{cultura}$ | **€ 25** | Coperto al 100% dal fondo Startup |
| **Biglietti omaggio per beneficiario** | $B$ | **2 biglietti** | Lavoratore + accompagnatore |
| **Adozione Store Prodotti Km 0** | `km0` | **20%** | $1.600$ acquirenti attivi (riservato ai beneficiari dei voucher welfare) |
| **Frequenza acquisti cesti** | `freqKm0` | **6 ordini/anno** | Cadenza ogni circa 2 mesi |
| **Scontrino medio paniere Km 0** | `scontrinoKm0` | **€ 30** | Valore standard per paniere |
| **Totale panieri Km 0 consegnati** | $C_{km0}$ | **9.600 / anno** | $1.600 \times 6$ |
| **Fatturato annuo filiera Km 0** | $VM_{km0}$ | **€ 288.000** | $9.600 \times 30\text{ €}$ |
| **Tratta media evitata per consegna** | `kmTratta` | **50 km** | Flotta logistica ordinaria a capacità residua |
| **Fattore emissioni autotrasporto** | `co2` | **0,19 kg CO₂/km** | Parametro emissivo van leggeri |
| **CO₂ evitata all'anno** | - | **91,2 t CO₂** | $9.600 \times 50\text{ km} \times 0,19\text{ kg} / 1000$ |
| **Base Spesa Diretta nei Borghi (3.520 presenze a coppie)** | - | **€ 564.925 / anno** | $3.520 \times 160,49\text{ €}$ ($75\text{ €}$ welfare monetizzato + $85,49\text{ €}$ spesa viva Santagata) |
| **Moltiplicatore Macroeconomico Tor Vergata** | - | **2,408×** *(+140,8% indotto)* | Rapporto PIL Turismo (Fonte: Studio Fondazione Tor Vergata) |
| **Quota Indotta Territoriale Addizionale (+140,8%)** | - | **€ 795.238 / anno** | $564.925\text{ €} \times 1,4077$ (indotto, catena fornitura, crescita) |
| **Subtotale Impatto Turismo nei Borghi (2,408×)** | - | **€ 1.360.163 / anno** | $564.925\text{ €} \times 2,4077$ |
| **Fatturato Filiera Km 0 (Aggiunto a Saldo)** | $VM_{km0}$ | **€ 288.000 / anno** | $9.600 \text{ panieri} \times 30\text{ €}$ (**escluso dal moltiplicatore, aggiunto solo a saldo**) |
| **Valore Complessivo Globale di Sistema** | - | **€ 1.648.163 / anno** | Impatto Turismo ($1.360.163\text{ €}$) + Filiera Km 0 ($288.000\text{ €}$) |
| **Costi Operativi Promotori (3 FTE)** | - | **€ 100.000 / anno** | Personale dedicato Startup (Illiria: fiducia e tratte ordinarie a costo zero) |
| **Leva Sociale SROI Netta a Regime** | - | **16,48×** *(~16,5×)* | $1.648.163\text{ €} / 100.000\text{ €}$ |

---

## 2. Utilizzo nei progetti

Aggiungere al proprio `package.json`:

```json
{
  "dependencies": {
    "shared-value-core": "file:../../shared-value-core"
  }
}
```

E importare direttamente nel codice TypeScript / React:

```typescript
import {
  INVARIANT_CONSTANTS,
  SCENARIO_REGIME_200,
  calculateMacroImpact,
  calculateCompanySimulator,
  formatEur
} from "shared-value-core";

// Calcolo macro per l'ecosistema
const macro = calculateMacroImpact(SCENARIO_REGIME_200);
console.log(macro.fatturatoKm0); // 288000

// Calcolo per il simulatore aziendale (es. 40 dipendenti)
const company = calculateCompanySimulator(40);
console.log(company.impattoDiretto); // 3180 (40 * 79.5)
```

---

## 3. Benchmark Econometrici & Moltiplicatori Raccordati (Tor Vergata & Santagata)

Centralizzazione del raccordo matematico tra spesa welfare monetizzata, spesa viva empirica ed effetto moltiplicatore macroeconomico:

| Parametro Econometrico | Valore | Fonte / Riferimento | Note Operative |
| :--- | :---: | :--- | :--- |
| **Welfare Monetizzato Soggiorno** | **€ 75,00** | Budget Welfare Aziendale (TUIR art. 51) | Hotel 1ª serata (50 €) + Aperitivo-Cena tipico (25 €) |
| **Spesa Viva Extra-Alloggio** | **€ 85,49** | Fondazione Santagata (Borgate dal Vivo) | Spesa non monetizzata (Trasporti 15,99 €, Ristorazione 29,39 €, Cultura 17,02 €, Shopping 23,09 €) |
| **Base Diretta Effettiva Territoriale** | **€ 160,49** | $75\text{ €} + 85,49\text{ €}$ | Spesa diretta complessiva (Base 100) nei 2 giorni continuativi |
| **Leva Diretta Primaria** | **2,14×** | $160,49\text{ €} / 75,00\text{ €}$ | Moltiplicatore di sola spesa viva diretta sul territorio |
| **Moltiplicatore Macro di Sistema** | **2,40×** *(2,408×)* | Studio Econometrico Fondazione Tor Vergata | **Sostituisce il forfettario 2×**: Totale Settore (379,356 Mld) su Diretti (157,56 Mld) = 240,8% |
| **Impatto Non Diretto Addizionale** | **+140,8%** | Fondazione Tor Vergata | Indiretti (32,1%) + Indotti (13,8%) + Crescita (52,6%) + Equilibrio (42,3%) |
| **Impatto Totale di Sistema Pro Capite** | **€ 386,41** | $160,49\text{ €} \times 2,4077$ | Ricaduta economica complessiva di sistema per partecipante |
| **Moltiplicatore di Leva Complessiva ($x$)** | **5,15×** | $386,41\text{ €} / 75,00\text{ €}$ | **Ogni euro di spesa welfare attiva 5,15 € di impatto sistemico territoriale** |

