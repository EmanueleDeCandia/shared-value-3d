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

## 3. Parametri del Modello Matematico (Single Source of Truth)

Tutti i parametri invarianti, gli scenari e le formule matematiche sono centralizzati nel pacchetto file-based condiviso:
**[`shared-value-core`](file:///c:/Users/user/Desktop/shared-value-core)**, importato come dipendenza diretta.

### 3.1 Costanti Invarianti
| Costante | Valore | Descrizione |
|---|---|---|
| Quota Voucher Hotel | **€ 50** | Quota welfare per soggiorno/agriturismo (deducibile TUIR art. 51) |
| Quota Voucher Food | **€ 25** | Quota welfare per ristorazione/degustazione tipica |
| Scontrino medio Km 0 | **€ 30** | Spesa media per ordine cesto agricolo certificato |
| Copertura Matching Grant | **€ 25 / biglietto** | Copertura a carico esclusivo del fondo Startup |
| Biglietti per beneficiario | **2** | Lavoratore + accompagnatore (esperienza condivisa) |
| Moltiplicatore presenze coppia | **2×** | Raddoppio presenze turistiche e a tavola nei borghi |
| Spesa indotta 2a giornata | **€ 100** | Indotto medio per notte trascorsa nel borgo |
| Tratta logistica evitata | **50 km** | Risparmio per consegna sui giri ordinari di rifornimento |
| Fattore emissioni autotrasporto | **0,19 kg CO₂/km** | Coefficiente di calcolo emissioni evitate (van leggeri) |
| Moltiplicatore Intangibile ESG | **2,0×** | Rapporto tra valore non monetizzabile diffuso e valore monetizzabile diretto |

---

### 3.2 Scenari Ufficiali di Sistema

#### A. Scenario Ufficiale Target a Regime: `SCENARIO_REGIME_200` (Predefinito)
Adottato nelle Card di Reporting ESG e nella Landing Page Clienti:

| Parametro | Valore | Descrizione |
|---|---|---|
| **Aziende clienti attive** | **200 imprese** | Rete delle imprese partner territoriali |
| **Dipendenti medi per azienda** | **40 persone** | Taglia media organico |
| **Popolazione totale ($W$)** | **8.000 lavoratori** | $200 \times 40$ |
| Adozione buono soggiorno ($T_{hotel}$) | **22%** | $1.760$ beneficiari |
| Adozione buono food ($T_{food}$) | **32%** | $2.560$ beneficiari |
| Adozione acquisto Km 0 ($T_{km0}$) | **30%** | $2.400$ acquirenti attivi |
| Frequenza ordini cesti Km 0 | **8 ordini/anno** | Cadenza periodica ogni circa 6 settimane |
| **Panieri Km 0 consegnati** | **19.200 panieri** | $2.400 \times 8$ |
| **Fatturato annuo filiera Km 0** | **€ 576.000** | $19.200 \times 30\text{ €}$ |
| **CO₂ evitata** | **182,4 tonnellate** | $19.200 \times 50\text{ km} \times 0,19\text{ kg} / 1000$ |
| **Valore Monetizzabile Diretto Esteso** | **€ 924.000 / anno** | Hotel (€ 176k) + Food (€ 128k) + Cultura (€ 44k) + Km 0 (€ 576k) |
| **Flusso monetizzabile pro capite** | **€ 115,50 / persona** | € 924.000 / 8.000 addetti |
| **Valore Intangibile ESG (2×)** | **€ 1.848.000 / anno** | Presidio demografico, tutela paesaggio e coesione |
| **Valore Complessivo di Sistema** | **€ 2.772.000 / anno** | Monetizzabile Esteso + Intangibile |

#### B. Scenario Pilota Iniziale: `SCENARIO_PILOTA_150`
Disponibile nei preset per simulazioni prudenziali di avvio:
* **150 aziende**, **30 dipendenti medi** (4.500 lavoratori totali)
* Adozioni: 16% hotel, 25% food, 20% Km 0 con 6 ordini annui (5.400 panieri = € 162.000)
* CO₂ evitata: 51,3 t

---

## 4. Architettura Multi-Applicazione

Grazie alla creazione del pacchetto locale **[`shared-value-core`](file:///c:/Users/user/Desktop/shared-value-core)**:
* Tutte le applicazioni leggono gli stessi parametri, costanti e formule.
* Qualsiasi modifica futura ai coefficienti di impatto o alle aliquote TUIR si propaga istantaneamente e in modo coerente in entrambe le applicazioni senza disallineamenti o ambiguità per gli stakeholder.
