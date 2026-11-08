# Verifica grafica e funzionale

final result: passed

## Riferimento ed evidenze

- Verità visiva: `../verifica-portale/riferimento.png`, prima proposta della seconda serie, selezionata dall'utente. Originale 1487 × 1058 px.
- Implementazione desktop verificata: `../verifica-portale/desktop-completo.jpg`, 1440 × 1024 px, cattura browser a pagina intera. Viewport CSS 1440 × 1024, densità normalizzata 1:1.
- Riferimento normalizzato a 1440 × 1024 per confronto dell'intera composizione; nessuna cornice del browser.
- Confronto affiancato: `../verifica-portale/confronto-verificato.jpg`.
- Dettaglio tipografico affiancato: `../verifica-portale/dettaglio-verificato.jpg`.
- Ulteriori catture: `../verifica-portale/tablet.jpg` e `../verifica-portale/mobile.jpg`. Le icone definitive radar e griglia sono state verificate nella vista tablet, dopo la cattura desktop.
- Stati verificati: normale, focus da tastiera sulla tile mappa, animazioni attive, pausa, ripresa e pausa persistente al caricamento.

## Cronologia delle correzioni

- [P2, risolto] Prima verifica: il contenuto superava di 22 px l'altezza desktop di 1024 px, spostando il footer sotto la piega. Corretto il calcolo dell'altezza delle tile. Nuova verifica DOM: altezza documento 1024 px, larghezza 1440 px, nessun overflow. La cattura desktop completa conferma il footer visibile.
- [P3, risolto] Tratto delle icone troppo pesante rispetto al mockup. Impostato a 1,5 sulle icone Tabler locali. Sostituite antenna televisiva e prospettiva con radar e griglia, più pertinenti ai servizi.

## Superfici controllate

- **Tipografia:** Manrope variabile salvato localmente, caricamento verificato nel browser. Titoli, descrizioni e dettagli leggibili; gerarchia coerente con il riferimento. Nessuna troncatura alle larghezze CSS 320, 390, 768 e 1440 px. Il carattere del mockup generato non identifica una famiglia tipografica certa: Manrope è una corrispondenza stilistica, non una ricostruzione pixel per pixel.
- **Spaziatura e impaginazione:** quattro tile in griglia 2 × 2, bordo sottile e angoli moderati, intestazione e footer compatti. Margini, gap e proporzioni allineati al riferimento. Una colonna su smartphone. I contenuti più lunghi vanno a capo senza uscire dalle tile.
- **Colori:** fondo petrolio #062b35, tile #093d4a, accenti indaco e acquamarina. Colori CSS verificati nel DOM; le catture del browser integrato mostrano una resa leggermente più desaturata del raster di riferimento. Contrasto dei testi preservato.
- **Risorse:** loghi CNR e ISMAR originali, font e icone SVG locali caricati correttamente. Nessuna fotografia decorativa. Icone di libreria coerenti per tratto, dimensione e allineamento. I diagrammi sono diventati animazioni canvas funzionali, come richiesto dall'utente, anziché illustrazioni raster statiche.
- **Contenuti:** SOM, Data Server, Dati su mappa e Modelli previsionali, con i testi concordati. Collegamento footer ISMAR in assenza di un contatto specifico. Aggiunto il solo controllo funzionale del movimento.

## Verifiche funzionali

- Navigazione da tastiera: focus visibile, tile raggiungibili e semantica dei collegamenti corretta.
- Quattro percorsi relativi predisposti: `./som/`, `./server/`, `./mappa/`, `./modelli/`. Le destinazioni non sono incluse, come concordato: non è una verifica dei servizi futuri.
- Tutte le risorse locali presenti e caricate; nessuna dipendenza da CDN o servizi applicativi.
- Pausa verificata confrontando due catture della stessa area animata: zero canali colore variati oltre la tolleranza JPEG. Ripresa verificata: 5926 canali variati nella stessa area.
- Preferenza di pausa conservata dopo ricaricamento. Riduzione del movimento gestita tramite media query e controllo JavaScript, senza modificare le preferenze del sistema dell'utente.
- Console browser: nessun errore rilevato durante caricamento e interazioni. Controllata nuovamente dopo l'aggiornamento delle icone.
- Sintassi JavaScript verificata e controllo statico di tutti i riferimenti superato.

## Limiti e differenze accettate

- Il test su nginx di produzione e le quattro destinazioni sarà possibile quando disponibili. La landing è stata servita e verificata via HTTP da una sottocartella locale.
- L'apertura diretta file:// non è stata verificata: il browser integrato ammette soltanto HTTP e HTTPS. Non è stato aggirato questo limite. La pagina usa script classici e percorsi relativi, senza fetch o moduli che richiedano un server applicativo.
- Il marchio e le icone non riproducono le approssimazioni del mockup generato: sono risorse originali e di libreria.
- Ultime catture ripetute durante il ripristino della viewport hanno intercettato una scheda vuota e sono escluse dal confronto finale. Le evidenze di riferimento elencate sopra sono le catture valide di desktop, tablet e smartphone.

Nessun problema P0/P1/P2 residuo nella landing. Gli URL definitivi si completano in config.js quando le destinazioni saranno disponibili.

## Revisione API e navigazione cartografica — 4 novembre 2026

final result: passed

- Riferimento: versione approvata dall'utente, con due variazioni richieste: evidenziare l'accesso API e rendere la navigazione dei dati chiaramente cartografica.
- Evidenza desktop: `../verifica-portale/revisione-api-mappa-desktop.jpg`, 1440 × 1024 px, viewport CSS corrispondente e densità 1:1.
- Evidenza mobile: `../verifica-portale/revisione-api-mappa-mobile.jpg`, viewport CSS 390 × 844 px, cattura della pagina completa.
- Confronto affiancato con la versione approvata: `../verifica-portale/confronto-api-mappa.jpg`. L'impaginazione, la tipografia e la palette conservano l'impostazione approvata; testi e risorse delle due tile cambiano intenzionalmente.
- Contenuti aggiornati: “Data Server / API”, “Accesso ai dati e alle API”, elenco delle piattaforme; “Esplora i dati”, “Mappa delle osservazioni”. Anche metadati e collegamenti senza JavaScript sono sincronizzati.
- Risorse: icona Tabler map-2 locale e base cartografica reale Natural Earth, ritagliata sul Mediterraneo; nessun servizio mappe remoto. Coastline e reticolo sono distinti dai punti illustrativi animati.
- [P2, risolto] Il primo controllo tablet mostrava la carta deformata dal ridimensionamento non uniforme del canvas. La scena cartografica usa ora la stessa scala orizzontale e verticale. Le nuove catture desktop e mobile confermano proporzioni geografiche coerenti, Italia riconoscibile e testi separati dalla carta.
- Controlli finali: nessuna troncatura o overflow a 1440 e 390 px; tutte le icone caricate; nessun errore console. Verifica sintattica JavaScript e controllo delle risorse locali superati.
- Nuova animazione verificata su due catture desktop della medesima area: 2398 canali colore variati oltre la tolleranza JPEG; evidenziazione progressiva dei punti visibile.

Nessun problema P0/P1/P2 residuo nella revisione.

## Modelli previsionali — 8 novembre 2026

- Aggiunta `models.html` con ISSOS, Kassandra, Henetus, Nettuno e AdriOper nell'ordine richiesto. Ogni scheda riserva almeno tre righe alla descrizione e cresce con il testo; homepage ancora da inserire, senza link fittizi attivi.
- Stile condiviso con Data Server: stessi loghi, font locale, palette, bordi, griglia e navigazione di ritorno. Collegamento dalla home aggiornato in `config.js` e nel blocco `noscript`.
- Verifica nel browser a 1280 × 720 e 390 × 844 px: due colonne su desktop, una su smartphone, nessun overflow orizzontale, tutte le immagini caricate. Controllata visivamente la leggibilità di intestazione, introduzione e schede.
- Navigazione verificata dalla pagina modelli alla home e dalla tile della home alla pagina modelli. Pagina HTTP 200; controllo statico dei cinque nomi, dei cinque spazi descrittivi e delle risorse locali superato, insieme al controllo esistente del portale e alla sintassi della configurazione.
- I contenuti definitivi e gli URL delle homepage restano da fornire; istruzioni di aggiornamento nel file HTML e nel README.

## Aggiunta Infrastrutture di Ricerca — 7 novembre 2026

- Aggiunta la quinta destinazione con titolo “Infrastrutture di Ricerca”, sottotitolo “Le infrastrutture di ricerca che collaborano con ISMAR” e URL `https://assets.ve.ismar.cnr.it/public/public_pages/ri/`. Collegamento presente anche senza JavaScript.
- Riutilizzata l'animazione delle stazioni marine; aggiunta un'icona SVG locale di rete, coerente con il tratto delle icone esistenti.
- Sesta tile vuota per completare la griglia a due colonne: nessun collegamento, testo, animazione o focus. Nascosta sotto i 641 px, quando la griglia passa a una colonna.
- Controlli sintattici JavaScript e controllo statico delle risorse locali superati. Il controllo distingue ora i collegamenti alle destinazioni dalle dipendenze esterne.
- Verifica visiva non completata: anteprima integrata non raggiungibile; il controllo del browser Windows si è interrotto perché non riusciva a identificare con certezza l'URL corrente. Le catture delle revisioni precedenti documentano la versione a quattro tile, non questa aggiunta.
