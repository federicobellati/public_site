# ISMAR · Dati e servizi

Landing statica, autonoma e responsive. Tutto ciò che occorre è in questa cartella.

## Installazione

Copia l'intera cartella sul server nginx, oppure copia il suo contenuto nella directory web desiderata. Il documento iniziale è `index.html`. Non occorrono Node.js, Python, PHP, database, comandi di installazione o compilazione. Tutti i percorsi delle risorse sono relativi: il portale può essere pubblicato anche in una sottocartella, per esempio `https://esempio.it/dati/`.

La directory web deve essere servita con il normale indice `index.html` e i MIME type standard di nginx (`include mime.types;`). Non servono regole di riscrittura, proxy o un backend. Accedere alla directory con la barra finale: nginx normalmente aggiunge automaticamente questa barra.

È possibile aprire `index.html` anche direttamente dal computer per vedere grafica e animazioni.

## Collegamenti da completare

Le pagine di destinazione saranno sviluppate separatamente e non sono incluse. I quattro collegamenti sono già predisposti in **config.js**:

| Tile | Percorso iniziale, da sostituire quando disponibile |
| --- | --- |
| SOM | `./som/` |
| Data Server / API | `./server/` |
| Esplora i dati · Mappa delle osservazioni | `./mappa/` |
| Modelli previsionali | `./modelli/` |

Modificare il valore `href` di ciascuna tile con un URL completo, un percorso dalla radice del dominio o un percorso relativo al portale. Finché le destinazioni non esistono, questi percorsi potranno restituire una pagina non trovata. Non sono presenti indirizzi fittizi di servizi reali.

Anche il collegamento ISMAR nel piè di pagina è configurabile. Non è stato inserito un indirizzo email di contatto non concordato.

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

`detail` è una seconda riga facoltativa. `newTab: true` apre una destinazione in una nuova scheda. `icon` corrisponde al nome di un file in `assets/icons/` senza estensione. Animazioni disponibili: `observatory`, `servers`, `map`, `models`. È possibile aggiungere altre icone SVG locali.

Se si modificano i collegamenti iniziali e serve il supporto senza JavaScript, aggiornare anche i quattro link nel blocco `noscript` di `index.html`.

## Animazioni e accessibilità

I diagrammi animati sono richiami visivi illustrativi, non misure o indicatori dello stato dei server. Le quattro animazioni sono disegnate nel browser, senza video o immagini da scaricare.

La tile “Esplora i dati” usa una base cartografica reale del Mediterraneo ricavata da Natural Earth, inclusa localmente in `assets/maps/mediterranean.js`. L'Italia, le coste e il reticolo geografico fanno da sfondo a punti illustrativi evidenziati in sequenza. Non vengono richieste mappe a servizi esterni. I punti non rappresentano un inventario reale delle osservazioni.

- Le tile reagiscono al cursore e al focus da tastiera.
- Il comando nel piè di pagina permette di sospendere e riattivare le animazioni. La preferenza resta sul dispositivo; non viene trasmessa.
- La preferenza di sistema per ridurre il movimento viene rispettata automaticamente alla prima visita.
- Il ciclo grafico è limitato a 30 fotogrammi al secondo. Le scene fuori schermo non vengono ridisegnate e il ciclo si ferma quando la scheda del browser è in background.
- Nessun tracciamento, cookie, chiamata API o dipendenza da CDN.

## File

- `index.html`: struttura della pagina.
- `config.js`: tile, testi, collegamenti e opzioni.
- `styles.css`: stile e adattamento a desktop, tablet e smartphone.
- `app.js`: genera la griglia a partire dalla configurazione.
- `motion.js`: animazioni locali e controlli del movimento.
- `assets/`: loghi originali, font e icone.
- `licenses/`: licenze dei componenti redistribuiti e provenienza dei loghi.

## Risorse

Loghi CNR e ISMAR originali dal sito istituzionale: https://www.ismar.cnr.it/. I marchi appartengono ai rispettivi titolari e non sono coperti dalle licenze di font e icone.

Carattere Manrope, distribuito con SIL Open Font License. Icone Tabler, distribuite con licenza MIT. Licenze complete nella cartella `licenses/`.
