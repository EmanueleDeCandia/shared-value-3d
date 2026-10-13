# README — Progetto Integrato Shared Value & Welfare Territoriale

Documento sintetico dei requisiti di progetto, modello di funzionamento, formule matematiche, parametri di input e metriche di output.
Partnership: **Gruppo Vending × Startup Innovativa × Imprese Clienti**.

---

## 1. Modello Funzionale & Partner

Il progetto implementa un modello di **Shared Value** in cui la competitività aziendale e il benessere della comunità locale sono interdipendenti.

### 1.1 Soggetti Coinvolti e Ruoli
* **Gruppo Vending:** Apporta portafoglio clienti B2B consolidato, relazioni fiduciarie con le direzioni HR, logistica dell'ultimo miglio (flotta di furgoni impiegata nei passaggi ordinari di manutenzione/rifornimento dei distributori). **Investimento monetario diretto: € 0**.
* **Startup Innovativa:** Apporta piattaforma tecnologica cloud (emissione, validazione e riscatto voucher), accreditamento della rete territoriale (produttori Km 0, strutture ricettive, ristorazione), fondo **Matching Grant** per la copertura integrale dei biglietti di ingresso a spettacoli (€25 cad.), strumenti di Growth & Referral Marketing.
* **Imprese Clienti B2B:** Finanziano i voucher welfare aziendale attingendo al 100% dai propri budget deducibili CSR.
* **Lavoratori/Dipendenti:** Fruitori dei voucher per spesa contadina Km 0, tempo libero, ospitalità e cultura; fungono da promotori (ambassador) verso colleghi di altre aziende.
* **Ecosistema Territoriale:** Produttori agricoli locali, hotel, agriturismi, operatori della ristorazione, artisti e compagnie di spettacolo.

---

## 2. Meccaniche Operative dei Flussi

### 2.1 Welfare Aziendale CSR (Origine del Valore)
1. Le imprese clienti stanziano fondi deducibili CSR sotto forma di voucher welfare: **€ 50** per hotel/agriturismi e **€ 25** per aperitivo tipico/ristorazione.
2. I voucher vengono gestiti e accreditati digitalmente dalla piattaforma Startup.
3. *Ritorno Gruppo Vending:* Posizionamento strategico come abilitatore del welfare direttamente al tavolo della Direzione HR e dell'Amministratore Delegato (superamento della logica di commodity legata al prezzo a cialda).

### 2.2 Filiera Km 0 & Logistica a Zero Emissioni Aggiuntive
1. I dipendenti ordinano cesti di prodotti locali via piattaforma.
2. I furgoni tecnici del Gruppo Vending, già pianificati nei passaggi settimanali di rifornimento e igienizzazione dei distributori, prelevano i cesti e li consegnano sul posto di lavoro.
3. Nessun mezzo extra su strada: azzeramento dei costi di trasporto per i produttori e annullamento delle emissioni logistiche dedicate.
4. *Ritorno Gruppo Vending:* Creazione di un dossier certificato di compensazione $\text{CO}_2$ e logistica green, spendibile con punteggi tecnici premianti nei capitolati di gara d'appalto pubblici e privati.

### 2.3 Matching Grant & Ospitalità Territoriale
1. La Startup copre interamente il costo dei biglietti per eventi e spettacoli culturali (**€ 25** per dipendente e accompagnatore).
2. L'accesso al biglietto abilita la fruizione dei voucher welfare aziendali (€50 alloggio + €25 ristorazione).
3. I dipendenti fruiscono del weekend sul territorio a costi vivi minimi, generando acquisti accessori (moltiplicatore indotto territoriale pari a **2,5×**).
4. *Ritorno Gruppo Vending:* Visibilità e co-branding come promotore ufficiale dell'esperienza durante il tempo libero dei lavoratori.

### 2.4 Cultura, Spettacolo & Rendicontazione ESG
1. Coinvolgimento e retribuzione di 20 artisti e maestranze locali a evento per circa 1.000 spettatori ad edizione.
2. Le imprese partner inseriscono i risultati nel Bilancio di Sostenibilità / Report ESG con metriche oggettive e certificate.
3. *Ritorno Gruppo Vending:* Piattaforma di PR & CSR congiunta e case history operative a supporto della rete commerciale per gare e offerte integrate.

### 2.5 Rete di Referral & Retention B2B
1. Al termine dell'esperienza il dipendente riceve il *Certificato Welfare & Impatto*.
2. Tramite la funzione di referral, il lavoratore invita colleghi di altre aziende a richiedere al proprio ufficio HR l'attivazione della convenzione.
3. Le direzioni HR ricevono richieste spontanee "dal basso" (inbound).
4. *Ritorno Gruppo Vending:*
   * **Acquisizione B2B a CAC azzerato:** Conversione di nuovi clienti enterprise grazie alle segnalazioni referenziate.
   * **Fidelizzazione / Anti-Churn:** Disdire il servizio distributori comporterebbe la revoca dei benefit aziendali per i dipendenti (barriera all'uscita).

---

## 3. Parametri del Modello Matematico

### 3.1 Costanti Invarianti
| Costante | Valore | Descrizione |
|---|---|---|
| Quota Voucher Hotel | **€ 50** | Quota welfare per soggiorno/agriturismo |
| Quota Voucher Food | **€ 25** | Quota welfare per ristorazione/degustazione |
| Scontrino medio Km 0 | **€ 30** | Spesa media per ordine cesto agricolo |
| Fattore emissioni autotrasporto | **0,19 kg CO₂/km** | Coefficiente di calcolo emissioni evitate |
| Matching Grant | **€ 25 / biglietto** | Copertura a carico esclusivo della Startup |
| Moltiplicatore indotto | **2,5×** | Rapporto spesa voucher / spesa complessiva sul territorio |
| Biglietti per beneficiario | **2** | Lavoratore + accompagnatore |
| Quota di adesione referral | **25%** | Percentuale beneficiari che attivano inviti |
| Inviti medi per persona | **5** | Numero inviti inviati |
| Tasso di conversione inviti | **25%** | Tasso di conversione del passaparola |
| **K-Factor virale** | **0,3125** | $25\% \times 5 \times 25\%$ |

### 3.2 Variabili di Input (Valori di Default e Range)
| Variabile | Chiave | Min | Max | Step | **Valore Default** |
|---|---|---|---|---|---|
| Aziende clienti attive | `aziende` | 10 | 400 | 5 | **150** |
| Dipendenti medi per azienda | `dip` | 5 | 120 | 1 | **30** |
| Adozione buono soggiorno | `hotel` | 0 | 60% | 1% | **16%** |
| Adozione Voucher Aperitivo-Cena | `aper` | 0 | 60% | 1% | **25%** |
| Acquisto Prodotti Km 0 | `km0` | 0 | 60% | 1% | **20%** |
| Ordini di cesti all'anno | `freq` | 1 | 12 | 1 | **6 ordini/anno** |
| Tratta logistica evitata (km) | `km` | 10 | 200 | 5 | **50 km** |
| Abbandono attuale dei clienti | `churnA` | 0 | 30% | 1% | **10%** |
| Abbandono con welfare attivo | `churnB` | 0 | 30% | 1% | **2%** |
| Generazione di richieste spontanee | `prospect` | 0 | 60% | 1% | **30%** |
| Tasso di chiusura dei contratti | `chiusura` | 0 | 60% | 1% | **20%** |
| Customer Lifetime Value (CLV) | `clv` | € 1.000 | € 5.000 | 50 | **€ 1.250** |

*Regola di calcolo:* $\Delta \text{churn} = \max(0, \text{churnA} - \text{churnB})$.

---

## 4. Formule di Calcolo e Output Verificati (Valori di Default)

Tutti i valori sono calcolati sui parametri di default definiti al §3:

| # | Metrica | Formula Matematica | Sostituzione Numerica | **Output Risultante** |
|---|---|---|---|---|
| 1 | Popolazione lavoratori raggiunta ($W$) | $W = \text{Aziende} \times \text{Dipendenti}$ | $150 \times 30$ | **4.500** |
| 2 | Welfare seed | $\text{Seed} = W \times \max(\text{Ad. Hotel}, \text{Ad. Food})$ | $4.500 \times 25\%$ | **1.125** |
| 3 | Biglietti omaggio emessi | $B = \text{Seed} \times 2$ | $1.125 \times 2$ | **2.250** |
| 4 | Valore Matching Grant Startup | $\text{MG} = B \times 25$ | $2.250 \times 25$ | **€ 56.250** |
| 5 | Budget welfare complessivo attivato | $(W \times h\% \times 50) + (W \times a\% \times 25)$ | $(4.500 \times 16\% \times 50) + (4.500 \times 25\% \times 25)$ | **€ 64.125** |
| 6 | Spesa indotta territoriale | $\text{Indotto} = \text{Budget Welfare} \times 2{,}5$ | $64.125 \times 2{,}5$ | **€ 160.313** |
| 7 | Acquirenti della filiera corta | $\text{Acq} = W \times \text{Ad. Km0}$ | $4.500 \times 20\%$ | **900** |
| 8 | Consegne annue | $C = \text{Acq} \times \text{Frequenza}$ | $900 \times 6$ | **5.400** |
| 9 | Fatturato della filiera | $F = C \times 30$ | $5.400 \times 30$ | **€ 162.000** |
| 10 | Logistica stradale evitata | $\text{Km} = C \times \text{km/tratta}$ | $5.400 \times 50$ | **270.000 km** |
| 11 | Emissioni evitate | $\text{CO}_2 = \text{Km} \times 0{,}19$ | $270.000 \times 0{,}19 = 51.300\text{ kg}$ | **51,3 t** |
| 12 | Valore generato per l'ecosistema | $F + \text{Indotto} + \text{MG}$ | $162.000 + 160.312{,}5 + 56.250$ | **€ 378.563** |
| 13 | Ambasciatori del welfare | $\text{Seed} \times 25\%$ | $1.125 \times 0{,}25$ | **281** |
| 14 | Inviti generati | $\text{Ambasciatori} \times 5$ | $281{,}25 \times 5$ | **1.406** |
| 15 | Indice di viralità (K-Factor) | $25\% \times 5 \times 25\%$ | $0{,}25 \times 5 \times 0{,}25$ | **0,3125** |
| 16 | Aziende interessate (prospect) | $\text{Ambasciatori} \times \text{Tasso Prospect}$ | $281{,}25 \times 30\%$ | **84** |
| 17 | Nuovi contratti firmati | $\text{Prospect} \times \text{Tasso Chiusura}$ | $84{,}375 \times 20\%$ | **17** |
| 18 | Imprese clienti trattenute | $\text{Aziende} \times (\text{ChurnA} - \text{ChurnB})$ | $150 \times (10\% - 2\%)$ | **12** |
| 19 | Valore preservato dalla retention | $\text{Fidelizzate} \times \text{CLV}$ | $12 \times 1.250$ | **€ 15.000** |
| 20 | Valore commerciale complessivo | $(\text{Fidelizzate} + \text{Nuovi Contratti}) \times \text{CLV}$ | $(12 + 16{,}875) \times 1.250$ | **€ 36.094** |
| 21 | Riduzione dell'abbandono | $\frac{\text{ChurnA} - \text{ChurnB}}{\text{ChurnA}}$ | $\frac{10 - 2}{10}$ | **−80%** |

---

## 5. Indicatori di Sintesi Chiave (Cruscotto Finale)

* **Impatto Sociale e Persone:** 4.500 lavoratori raggiunti; 2.250 biglietti per spettacoli erogati; 20 artisti/evento retribuiti.
* **Impatto Ambientale:** 270.000 km di logistica neutralizzati; **51,3 tonnellate di CO₂ evitate**.
* **Impatto Territoriale:** € 162.000 fatturato agricolo; € 160.313 spesa indotta locale; € 56.250 Matching Grant coperto da Startup (**€ 378.563 Valore Ecosistema**).
* **Impatto Commerciale (Gruppo Vending):**
  * Tasso di abbandono (Churn) abbattuto dal 10% al 2% (**−80%**).
  * 12 imprese clienti trattenute (€ 144.000 valore preservato).
  * 17 nuovi contratti aziendali sottoscritti a CAC pari a zero.
  * **€ 348.000 complessivi di valore B2B generato e protetto**.
  * Posizionamento strategico come partner welfare ed ESG con dossier spendibili nelle gare d'appalto.
