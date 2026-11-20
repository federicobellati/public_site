# ISMAR · Dati e servizi

Landing statica, autonoma e responsive. Tutto ciò che occorre è in questa cartella.

## Installazione

Copia l'intera cartella sul server nginx, oppure copia il suo contenuto nella directory web desiderata. Il documento iniziale è `index.html`. Non occorrono Node.js, Python, PHP, database, comandi di installazione o compilazione. Tutti i percorsi delle risorse sono relativi: il portale può essere pubblicato anche in una sottocartella, per esempio `https://esempio.it/dati/`.

La directory web deve essere servita con il normale indice `index.html` e i MIME type standard di nginx (`include mime.types;`). Non servono regole di riscrittura, proxy o un backend. Accedere alla directory con la barra finale: nginx normalmente aggiunge automaticamente questa barra.

È possibile aprire `index.html` anche direttamente dal computer per vedere grafica e animazioni.

La tile Dashboard richiede l'accesso via HTTP/HTTPS e l'autorizzazione CORS dell'API per l'origine del portale. Aprendo la pagina da file o da un'origine non autorizzata, il portale resta utilizzabile e la tile mostra “Dati non raggiungibili”.

## Collegamenti da completare

I collegamenti sono configurati in **config.js**; le pagine SOM, Data Server, Modelli previsionali, Facilities e Profiles sono incluse:

| Tile | Percorso iniziale, da sostituire quando disponibile |
| --- | --- |
| SOM | `./som.html` (pagina inclusa) |
| Data Server / API | `./dataservers.html` (pagina inclusa) |
| Esplora i dati · Mappa delle osservazioni | `http://erddapdash.ve.ismar.cnr.it/` (collegamento definitivo) |
| Modelli previsionali | `./models.html` (pagina inclusa) |
| Infrastrutture di Ricerca (dentro SOM) | `https://assets.ve.ismar.cnr.it/public/public_pages/ri/` (collegamento definitivo) |
| Facilities Map (dentro SOM) | `./facilities.html` (mappa inclusa) |
| Facilities · registro (dentro SOM) | `https://assets.ve.ismar.cnr.it/public/public_pages/fac/` (cartella autonoma `../facilities-registry/`, da pubblicare separatamente) |
| Organizations (dentro SOM) | `https://assets.ve.ismar.cnr.it/public/public_pages/org/` (collegamento definitivo) |
| Sensor Models (dentro SOM) | `https://assets.ve.ismar.cnr.it/public/public_pages/sensmod/` (collegamento definitivo) |
| Dashboard | `https://assets.ve.ismar.cnr.it/public/public_pages/dashboards/qc_dash.html` (collegamento definitivo) |
| Data Policy e Data Management Plan | `./datapolicy.html` (policy v2.0, PDF firmato e collegamento al DMP) |
| IS-mA-BOT | `https://assets.ve.ismar.cnr.it/public/public_pages/isabot-metadata/chatbot.html` (collegamento definitivo) |
| Profiles · Profili semantici delle entità | `./profiles.html` (pagina inclusa) |
| Altre risorse | `./otherresources.html` (pagina inclusa) |
| Locations (dentro SOM) | `https://assets.ve.ismar.cnr.it/public/public_pages/loc/` (collegamento definitivo) |

Modificare il valore `href` di ciascuna tile con un URL completo, un percorso dalla radice del dominio o un percorso relativo al portale. Un valore vuoto (`href: ""`) mantiene la tile visibile con l'indicazione “Pagina in preparazione”, senza un collegamento che ricarichi la pagina o apra la home. Non sono presenti indirizzi fittizi di servizi reali.

## SOM: mappa ed elenco

`som.html` si apre nella vista Mappa. Il selettore Mappa / Elenco mostra alternativamente il diagramma delle nove entità o la griglia di dieci tile, compresa Facilities Map. Sensor Models apre il registro dei modelli di sensore, disponibile anche nell'elenco senza JavaScript.

Nella mappa, il riquadro seleziona l'entità e ne evidenzia le relazioni; l'icona è un collegamento separato alla sua pagina. Per Environmental variable, Deployments, Datasets e Features of Interest la destinazione è ancora vuota e l'icona è disattivata. I titoli e gli indirizzi sono letti dalle stesse voci `somTiles` di `config.js`, identificate dal campo `entity`: completare `href` abilita sia la tile nell'elenco sia l'icona nella mappa. Sensor Models apre `https://assets.ve.ismar.cnr.it/public/public_pages/sensmod/` nella stessa scheda, come le altre entità disponibili.

`som-map.js` definisce disposizione e relazioni; `som-map.css` mantiene lo stile del mockup approvato. Il grafo conserva le undici relazioni dello schizzo, senza direzionalità. Su schermi piccoli, lo scorrimento è confinato alla mappa, centrata inizialmente su Datasets; l'elenco usa la griglia responsive del portale. Senza JavaScript è disponibile l'elenco testuale delle sezioni.

Anche il collegamento ISMAR nel piè di pagina della home è configurabile. Non è stato inserito un indirizzo email di contatto non concordato.

## SOM · Sistema Osservativo Marino

La home contiene nove tile. SOM apre `som.html`, nella stessa cartella di `index.html`, con cinque tile: Locations, Infrastrutture di Ricerca, Facilities, Facilities Map e Organizations, con icone e animazioni nello stile condiviso del portale.

Le cinque tile sono configurate nell'array `somTiles` di **config.js**; `tiles` contiene solo quelle della home. La pagina riutilizza le risorse locali del portale, mostra il percorso “Dati e servizi › SOM” per tornare alla home e dispone le tile su due colonne su desktop e una su smartphone. I collegamenti sono disponibili anche senza JavaScript. Il registro Facilities è preparato nella cartella separata `../facilities-registry/`, con tutte le proprie risorse, e va pubblicato a `/public/public_pages/fac/`. La mappa preesistente resta in `facilities.html`.

## Data server

`dataservers.html` contiene undici collegamenti a data server e API, inclusi APIAPP - Dati meteo, ERDDAP-DANUBIUS, ERDDAP-ITINERIS, ERDDAP-HRF NODE, SEAMAP Catalog e SEAMAP Explorer, con titoli e indirizzi visibili. La pagina usa lo stile condiviso del portale, dispone i riquadri su due colonne e passa a una colonna su smartphone. Funziona anche senza JavaScript.

Con JavaScript attivo, `server-status.js` aggiunge un pallino accanto a ogni titolo ed esegue un solo GET per servizio all'apertura della pagina, senza credenziali e senza scaricare integralmente il corpo della risposta. Verde: risposta HTTP riuscita; rosso: errore HTTP leggibile o nessuna risposta entro 5 secondi; grigio: controllo non verificabile, per esempio per CORS o blocco HTTP da una pagina HTTPS. Il timeout descrive il controllo dal browser del visitatore, non certifica un guasto del server. Nessuna dicitura visibile, tooltip o aggiornamento periodico; lo stato è disponibile anche agli screen reader. L'attributo facoltativo `data-status-url` indica l'indirizzo da controllare quando serve evitare un reindirizzamento senza CORS o usare HTTPS; non modifica il link della scheda. Il controllo dell'API meteo è consentito dall'origine `https://assets.ve.ismar.cnr.it`, ma può restare grigio in anteprima locale.

Per aggiungere un server, duplicare un elemento `<li>` dentro `<ul class="server-list">` in **dataservers.html** e aggiornare il titolo (`server-title`), l'indirizzo visibile (`server-url`) e il collegamento (`href`). La griglia si adatta automaticamente. I collegamenti si aprono nella stessa scheda; “Dati e servizi” e i loghi riportano alla home.

## Modelli previsionali

`models.html` elenca ISSOS, Kassandra, Henetus, Nettuno e AdriOper, nello stile condiviso del portale: due colonne su desktop e una su smartphone. La pagina funziona senza JavaScript ed è collegata alla tile della home, anche nel blocco `noscript`.

Kassandra collega `http://kassandra.ve.ismar.cnr.it:8080/kassandra`.

Ogni riquadro riserva spazio per una descrizione di circa 200 caratteri. Sostituire “Descrizione in arrivo.” nel paragrafo `model-description` con il testo definitivo; lo spazio si espande se necessario. Quando disponibile, sostituire `<span class="model-homepage">Collegamento in arrivo</span>` con `<a class="model-homepage" href="URL-DELLA-HOMEPAGE">Vai al modello →</a>`, usando l'indirizzo effettivo. Al momento non sono presenti collegamenti fittizi alle homepage dei modelli. Per aggiungere un modello, duplicare un elemento `<li>` e aggiornare anche l'ID del titolo e il relativo `aria-labelledby`.

## Data Policy e Data Management Plan

`datapolicy.html` contiene il testo inglese completo della **CNR-ISMAR Data Policy v2.0**, approvata il **30 aprile 2026**, con cronologia delle versioni, indice navigabile, definizioni, riferimenti e i due allegati. I richiami bibliografici portano alle rispettive voci. La pagina riutilizza loghi e font del portale, con un'area di lettura chiara, indice laterale su desktop, tabelle a scorrimento su smartphone e stile per la stampa. Tutte le funzioni sono disponibili senza JavaScript.

Il pulsante di download e il collegamento di lettura aprono `assets/documents/RT-58-ISMAR_Data_Policy_v2.0_signed-1.pdf`, copia identica del PDF originale firmato (19 pagine). I simboli Creative Commons in `assets/policy/` sono estratti dal documento. Il testo HTML conserva la formulazione della policy; sono stati ricomposti soltanto gli artefatti di estrazione, le tabelle e i collegamenti spezzati. L'Allegato II è una riproduzione per consultazione, con accesso diretto alla pagina 17 del PDF per la richiesta; non raccoglie né invia dati online.

Il riquadro **Data Management Plan** collega il documento di Caccavale, Corgnati e Grande (2024) al DOI `https://doi.org/10.26383/CNR-ISMAR.2024.5`, riportato nel riferimento [17] della policy. Lo stile specifico è in `datapolicy.css`. Per la pubblicazione mantenere insieme pagina, foglio di stile e risorse in `assets/`; tutti i percorsi sono relativi alla cartella del portale.

## Profiles

`profiles.html` contiene 22 voci in un elenco compatto a colonna singola: dieci Semantic application profiles, dieci Registry, un'ontologia (Sensor Description Mapping) e un Metadata Profile (DANUBIUS · In situ · 1.0.0). Il gruppo Metadata Profiles è in fondo alla pagina e include il collegamento al repository pubblico `https://github.com/federicobellati/metadata-profiles` e il prefix `danmetaprof:`. Ogni riga affianca un'etichetta cliccabile, la dichiarazione Turtle completa `@prefix nome: <URI> .` e il pulsante dedicato alla copia. I collegamenti mantengono gli indirizzi w3id.org forniti. Per Ultimate Feature of Interest viene usato `sapufoi:`, distinto da `sapfoi:`. La pagina usa lo stile condiviso, con link e dichiarazione sulla stessa riga su desktop e una disposizione adattata agli schermi piccoli; link e dichiarazioni restano leggibili senza JavaScript. `profiles.js` abilita i pulsanti di copia, conferma il successo con una spunta e supporta anche la copia tramite selezione quando l'API clipboard non è disponibile. La tile della home mostra “Profiles” e il sottotitolo “Profili semantici delle entità”.

## Altre risorse

La nona tile della home, con icona dedicata `toolbox.svg`, apre `otherresources.html`. La pagina elenca NetCDF to Zarr (`https://netcdf2zarr.lab.dive.edito.eu/`) e Zarr Visualizer (`https://zarr-visualizer.lab.dive.edito.eu/`), con lo stile condiviso di Data Server e collegamento di ritorno alla home. Funziona anche senza JavaScript. Per aggiungere risorse, duplicare una voce della lista e aggiornare titolo e indirizzo.

## Facilities

`facilities.html` mostra i soli contorni dello Stato italiano, con le isole, senza riempimenti, confini regionali o Paesi limitrofi. La base cartografica Natural Earth 1:10m è inclusa in `assets/maps/italy-outline.svg`: la pagina funziona anche senza JavaScript e senza servizi cartografici esterni.

La stessa icona AAOT della tile Facilities è centrata alle coordinate **45.3142467 N, 12.5082483 E**, pubblicate da ISMAR: https://www.ismar.cnr.it/en/what-we-do/oceanographic-infrastructures/acqua-alta-oceanographic-tower/. La posizione usa la medesima proiezione di Mercatore del contorno, e resta allineata durante il ridimensionamento. L’icona è accessibile da tastiera e rimanda a **`./AAOT.html`** (maiuscole comprese), da creare nella stessa cartella; la pagina AAOT non è inclusa.

Sono presenti anche **Paloma** (45.618283 N, 13.565217 E), **S1GB** (44.7384 N, 12.4526 E) e **E1** (44.14325 N, 12.5701 E). Paloma e S1GB condividono l’icona `assets/icons/meda.svg`, nella versione approvata con palo slanciato; E1 usa `assets/icons/boa-e1.svg`. Le icone aprono rispettivamente la scheda ISMAR di Paloma, la scheda JERICO di S1GB e la scheda DEIMS di E1. I nomi compaiono al passaggio del cursore e al focus da tastiera; nomi e coordinate sono riportati anche sotto la mappa. Su smartphone le icone si riducono per separare le stazioni vicine.

Coordinate: [Paloma, CNR-ISMAR](https://www.ismar.cnr.it/web-content/cosa-facciamo/infrastrutture-oceanografiche/meda-paloma/), [S1GB, JERICO](https://www.jerico-ri.eu/infrastructure/meteoceanographic-site-s1-gb/), [E1, rapporto CNR-ISMAR](https://www.ismar.cnr.it/wp-content/uploads/2023/11/RT_Rete-Naz-Siti-Osservativi-Marini_ITA__ENG.pdf). Ogni posizione è memorizzata nei valori `data-latitude` e `data-longitude` del relativo collegamento. Il generatore locale `../verifica-portale/prepara-facilities.mjs` ricalcola tutte le posizioni con la stessa proiezione della mappa.

## Aggiungere una tile

Duplicare un oggetto nell'array `tiles` di **config.js**, cambiando titolo, descrizione e collegamento. Non occorre modificare l'impaginazione: la griglia aggiunge automaticamente altre righe.

```javascript
{
  id: "immagini",
  title: "Immagini sottomarine",
  description: "Esplora gli archivi di immagini",
  href: "./immagini/",
  icon: "map-pin",
  animation: "map"
}
```

`detail` è una seconda riga facoltativa. `newTab: true` apre una destinazione in una nuova scheda. `icon` corrisponde al nome di un file in `assets/icons/` senza estensione. Animazioni disponibili: `observatory`, `servers`, `map`, `models`, `infrastructure`, `facilities`, `dashboard`, `policy`, `chatbot`. È possibile aggiungere altre icone SVG locali.

La terza tile della pagina SOM è “Facilities” e apre il registro esterno configurato; la quarta è “Facilities Map”, con sottotitolo “Piattaforme e reti di strumenti osservativi” e un'icona originale ispirata alla piattaforma AAOT, e apre `facilities.html`. Sono entrambe disponibili anche su smartphone.

Se si modificano i collegamenti e serve il supporto senza JavaScript, aggiornare anche i link nel blocco `noscript` di `index.html` o `som.html`, secondo la pagina interessata.

## Animazioni e accessibilità

I diagrammi animati sono richiami visivi illustrativi, tranne la Dashboard, che visualizza le misure reali descritte sotto. Non sono indicatori dello stato dei server. Le animazioni sono disegnate nel browser, senza video o immagini da scaricare.

### Dashboard · Acqua Alta

La tile mostra marea in metri, altezza significativa delle onde in metri e velocità del vento in m/s dall'endpoint `https://apiapp.ve.ismar.cnr.it/api/fetch-data/?format=json`. Usa i campi `livello`, `onda_altezza_significativa`, `vento_velocita` e `vento_direzione` della piattaforma Acqua Alta; ignora gli eventuali campi legacy `wind_ave10` e `dir_ave10`. La freccia indica la provenienza del vento: 0° nord, 90° est. La scala della marea e l'ampiezza delle onde seguono i valori ricevuti; il movimento è un richiamo illustrativo, non una serie temporale di misure.

L'indirizzo e l'intervallo di aggiornamento sono configurabili in `config.js`, nella sezione `dashboard`. La richiesta parte al caricamento e viene ripetuta ogni cinque minuti, con timeout di dieci secondi; il polling si sospende in background. Non vengono inviati cookie o credenziali, né usati proxy esterni o Open-Meteo.

Un trattino sostituisce le singole misure assenti o non numeriche, senza impedire la lettura delle altre. In caso di errore di rete, CORS o risposta non valida, la tile mostra “Dati non raggiungibili” e rimuove i valori precedenti; riprova all'aggiornamento successivo. Non sono presenti valori di ripiego simulati.

La data e l'ora sono quelle riportate dall'API, senza conversione di fuso: l'API attuale non ne specifica uno. Se gli orari differiscono, sono disponibili nei dettagli delle singole misure, al passaggio del cursore e per gli strumenti di lettura dello schermo. Il pulsante di pausa ferma le animazioni ma consente l'aggiornamento dei dati.

La tile Data Policy usa l'animazione dedicata `policy`: tre piccoli insiemi di dati confluiscono in un documento, le righe ricevono una spunta e un sigillo finale completa il ciclo. Mantiene le proporzioni su smartphone e rispetta il comando di pausa e la preferenza di movimento ridotto.

La tile IS-mA-BOT usa l'animazione originale `chatbot`: un robot con occhi che sbattono le palpebre riceve una domanda, elabora con una piccola forma d'onda e compone una risposta in un fumetto. Il ciclo dura dieci secondi, mantiene le proporzioni su smartphone e segue gli stessi controlli di pausa e movimento ridotto.

La tile “Esplora i dati” usa una base cartografica reale del Mediterraneo ricavata da Natural Earth, inclusa localmente in `assets/maps/mediterranean.js`. L'Italia, le coste e il reticolo geografico fanno da sfondo a punti illustrativi evidenziati in sequenza. Non vengono richieste mappe a servizi esterni. I punti non rappresentano un inventario reale delle osservazioni.

- Le tile reagiscono al cursore e al focus da tastiera.
- Il comando nel piè di pagina permette di sospendere e riattivare le animazioni. La preferenza resta sul dispositivo; non viene trasmessa.
- La preferenza di sistema per ridurre il movimento viene rispettata automaticamente alla prima visita.
- Il ciclo grafico è limitato a 30 fotogrammi al secondo. Le scene fuori schermo non vengono ridisegnate e il ciclo si ferma quando la scheda del browser è in background.
- Nessun tracciamento, cookie o dipendenza da CDN. L'unica chiamata API è quella della tile Dashboard.

## File

- `index.html`: struttura della pagina.
- `som.html`: pagina SOM con le tile Locations, Infrastrutture di Ricerca, Facilities e Organizations.
- `dataservers.html`: elenco dei data server, con link diretti ai servizi.
- `models.html`: elenco dei modelli previsionali, con spazio per descrizioni e homepage future.
- `profiles.html`: elenchi di link ai profili semantici, ai registry e alle ontologie.
- `profiles.js`: copia delle dichiarazioni dei prefix e conferma accessibile dell'esito.
- `facilities.html`: mappa dei contorni italiani con AAOT, mede Paloma e S1GB e boa E1.
- `dashboard.html`: pagina vuota conservata localmente; la tile Dashboard punta al servizio esterno configurato in `config.js`.
- `datapolicy.html`: testo completo della Data Policy v2.0, allegati, download del PDF originale firmato e collegamento al DMP.
- `datapolicy.css`: impaginazione del documento, indice, tabelle responsive e stile per la stampa.
- `chatbot.html`: pagina vuota locale conservata; la tile IS-mA-BOT punta al servizio esterno.
- `locations.html`: pagina vuota conservata localmente; la tile Locations punta al servizio esterno configurato in `config.js`.
- `config.js`: tile, testi, collegamenti e opzioni.
- `styles.css`: stile e adattamento a desktop, tablet e smartphone.
- `app.js`: genera la griglia a partire dalla configurazione.
- `dashboard.js`: lettura dell'API Acqua Alta, formattazione delle misure e aggiornamento della tile.
- `motion.js`: animazioni locali e controlli del movimento.
- `assets/`: loghi originali, font e icone.
- `licenses/`: licenze dei componenti redistribuiti e provenienza dei loghi.

## Risorse

Loghi CNR e ISMAR originali dal sito istituzionale: https://www.ismar.cnr.it/. I marchi appartengono ai rispettivi titolari e non sono coperti dalle licenze di font e icone.

Carattere Manrope, distribuito con SIL Open Font License. Icone Tabler, distribuite con licenza MIT; icone di rete e AAOT disegnate localmente nello stesso stile. Licenze complete nella cartella `licenses/`.
