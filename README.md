# ISMAR · Dati e servizi

Landing statica, autonoma e responsive. Tutto ciò che occorre è in questa cartella.

## Installazione

Copia l'intera cartella sul server nginx, oppure copia il suo contenuto nella directory web desiderata. Il documento iniziale è `index.html`. Non occorrono Node.js, Python, PHP, database, comandi di installazione o compilazione. Tutti i percorsi delle risorse sono relativi: il portale può essere pubblicato anche in una sottocartella, per esempio `https://esempio.it/dati/`.

La directory web deve essere servita con il normale indice `index.html` e i MIME type standard di nginx (`include mime.types;`). Non servono regole di riscrittura, proxy o un backend. Accedere alla directory con la barra finale: nginx normalmente aggiunge automaticamente questa barra.

È possibile aprire `index.html` anche direttamente dal computer per vedere grafica e animazioni.

## Collegamenti da completare

La pagina SOM sarà sviluppata separatamente e non è inclusa. I collegamenti sono configurati in **config.js**; le pagine Data Server, Modelli previsionali e Facilities sono incluse:

| Tile | Percorso iniziale, da sostituire quando disponibile |
| --- | --- |
| SOM | `./som/` |
| Data Server / API | `./dataservers.html` (pagina inclusa) |
| Esplora i dati · Mappa delle osservazioni | `http://erddapdash.ve.ismar.cnr.it/` (collegamento definitivo) |
| Modelli previsionali | `./models.html` (pagina inclusa) |
| Infrastrutture di Ricerca | `https://assets.ve.ismar.cnr.it/public/public_pages/ri/` (collegamento definitivo) |
| Facilities | `./facilities.html` (mappa inclusa) |
| Dashboard | `./dashboard.html` (pagina vuota inclusa) |
| Data Policy e Data Management Plan | `./datapolicy.html` (pagina vuota inclusa) |
| IS-mA-BOT | `./chatbot.html` (pagina vuota inclusa) |

Modificare il valore `href` di ciascuna tile con un URL completo, un percorso dalla radice del dominio o un percorso relativo al portale. Finché le destinazioni non esistono, questi percorsi potranno restituire una pagina non trovata. Non sono presenti indirizzi fittizi di servizi reali.

Anche il collegamento ISMAR nel piè di pagina della home è configurabile. Non è stato inserito un indirizzo email di contatto non concordato.

## Data server

`dataservers.html` contiene i collegamenti ai cinque data server, con titoli e indirizzi visibili. La pagina usa lo stile condiviso del portale, dispone i riquadri su due colonne e passa a una colonna su smartphone. Funziona anche senza JavaScript.

Per aggiungere un server, duplicare un elemento `<li>` dentro `<ul class="server-list">` in **dataservers.html** e aggiornare il titolo (`server-title`), l'indirizzo visibile (`server-url`) e il collegamento (`href`). La griglia si adatta automaticamente. I collegamenti si aprono nella stessa scheda; “Dati e servizi” e i loghi riportano alla home.

## Modelli previsionali

`models.html` elenca ISSOS, Kassandra, Henetus, Nettuno e AdriOper, nello stile condiviso del portale: due colonne su desktop e una su smartphone. La pagina funziona senza JavaScript ed è collegata alla tile della home, anche nel blocco `noscript`.

Ogni riquadro riserva spazio per una descrizione di circa 200 caratteri. Sostituire “Descrizione in arrivo.” nel paragrafo `model-description` con il testo definitivo; lo spazio si espande se necessario. Quando disponibile, sostituire `<span class="model-homepage">Collegamento in arrivo</span>` con `<a class="model-homepage" href="URL-DELLA-HOMEPAGE">Vai al modello →</a>`, usando l'indirizzo effettivo. Al momento non sono presenti collegamenti fittizi alle homepage dei modelli. Per aggiungere un modello, duplicare un elemento `<li>` e aggiornare anche l'ID del titolo e il relativo `aria-labelledby`.

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

`detail` è una seconda riga facoltativa. `newTab: true` apre una destinazione in una nuova scheda. `icon` corrisponde al nome di un file in `assets/icons/` senza estensione. Animazioni disponibili: `observatory`, `servers`, `map`, `models`, `infrastructure`, `facilities`, `policy`. È possibile aggiungere altre icone SVG locali.

La quinta tile è “Infrastrutture di Ricerca”, con sottotitolo “Le infrastrutture di ricerca che collaborano con ISMAR”. La sesta è “Facilities”, con sottotitolo “Piattaforme e reti di strumenti osservativi” e un'icona originale ispirata alla piattaforma AAOT. È attiva anche su smartphone e apre `facilities.html`, nella stessa directory di `index.html`.

Se si modificano i collegamenti e serve il supporto senza JavaScript, aggiornare anche i link nel blocco `noscript` di `index.html`.

## Animazioni e accessibilità

I diagrammi animati sono richiami visivi illustrativi, non misure o indicatori dello stato dei server. Le animazioni sono disegnate nel browser, senza video o immagini da scaricare.

La tile Data Policy usa l'animazione dedicata `policy`: tre piccoli insiemi di dati confluiscono in un documento, le righe ricevono una spunta e un sigillo finale completa il ciclo. Mantiene le proporzioni su smartphone e rispetta il comando di pausa e la preferenza di movimento ridotto.

La tile “Esplora i dati” usa una base cartografica reale del Mediterraneo ricavata da Natural Earth, inclusa localmente in `assets/maps/mediterranean.js`. L'Italia, le coste e il reticolo geografico fanno da sfondo a punti illustrativi evidenziati in sequenza. Non vengono richieste mappe a servizi esterni. I punti non rappresentano un inventario reale delle osservazioni.

- Le tile reagiscono al cursore e al focus da tastiera.
- Il comando nel piè di pagina permette di sospendere e riattivare le animazioni. La preferenza resta sul dispositivo; non viene trasmessa.
- La preferenza di sistema per ridurre il movimento viene rispettata automaticamente alla prima visita.
- Il ciclo grafico è limitato a 30 fotogrammi al secondo. Le scene fuori schermo non vengono ridisegnate e il ciclo si ferma quando la scheda del browser è in background.
- Nessun tracciamento, cookie, chiamata API o dipendenza da CDN.

## File

- `index.html`: struttura della pagina.
- `dataservers.html`: elenco dei data server, con link diretti ai servizi.
- `models.html`: elenco dei modelli previsionali, con spazio per descrizioni e homepage future.
- `facilities.html`: mappa dei contorni italiani con AAOT, mede Paloma e S1GB e boa E1.
- `dashboard.html`: pagina vuota collegata alla tile Dashboard.
- `datapolicy.html`: pagina vuota collegata alla tile Data Policy e Data Management Plan.
- `chatbot.html`: pagina vuota collegata alla tile IS-mA-BOT, con sottotitolo “Chiedi al nostro chatbot!”.
- `config.js`: tile, testi, collegamenti e opzioni.
- `styles.css`: stile e adattamento a desktop, tablet e smartphone.
- `app.js`: genera la griglia a partire dalla configurazione.
- `motion.js`: animazioni locali e controlli del movimento.
- `assets/`: loghi originali, font e icone.
- `licenses/`: licenze dei componenti redistribuiti e provenienza dei loghi.

## Risorse

Loghi CNR e ISMAR originali dal sito istituzionale: https://www.ismar.cnr.it/. I marchi appartengono ai rispettivi titolari e non sono coperti dalle licenze di font e icone.

Carattere Manrope, distribuito con SIL Open Font License. Icone Tabler, distribuite con licenza MIT; icone di rete e AAOT disegnate localmente nello stesso stile. Licenze complete nella cartella `licenses/`.
