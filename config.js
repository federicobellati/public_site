/* Configurazione di collegamenti, testi e tile della home e della pagina SOM.
 * Sono accettati percorsi relativi (./som.html), assoluti (/som.html) o URL https://.
 */
window.ISMAR_PORTAL = {
  // Animazioni attive, salvo preferenze di accessibilità del visitatore.
  animations: true,
  dashboard: {
    endpoint: "https://apiapp.ve.ismar.cnr.it/api/fetch-data/?format=json",
    refreshMs: 300000
  },
  footer: {
    label: "ISMAR",
    href: "https://www.ismar.cnr.it/"
  },
  tiles: [
    {
      id: "som",
      title: "SOM",
      description: "Sistema Osservativo Marino",
      detail: "Locations, infrastrutture di ricerca e facilities",
      href: "./som.html",
      icon: "radar-2",
      animation: "observatory"
    },
    {
      id: "server",
      title: "Data Server / API",
      description: "Accesso ai dati e alle API",
      detail: "ERDDAP · THREDDS · GeoNode · CKAN",
      href: "./dataservers.html",
      icon: "stack-2",
      animation: "servers"
    },
    {
      id: "mappa",
      title: "Esplora i dati",
      description: "Mappa delle osservazioni",
      href: "http://erddapdash.ve.ismar.cnr.it/",
      icon: "map-2",
      animation: "map"
    },
    {
      id: "modelli",
      title: "Modelli previsionali",
      description: "Risultati dei modelli per area",
      href: "./models.html",
      icon: "grid-3x3",
      animation: "models"
    },
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Molti modi di vedere i nostri dati",
      href: "./dashboard.html",
      icon: "chart-data",
      animation: "dashboard"
    },
    {
      id: "datapolicy",
      title: "Data Policy e Data Management Plan",
      description: "Come governiamo i dati in Ismar",
      href: "./datapolicy.html",
      icon: "file-check",
      animation: "policy"
    },
    {
      id: "chatbot",
      title: "IS-mA-BOT",
      description: "Chiedi al nostro chatbot!",
      href: "./chatbot.html",
      icon: "chatbot",
      animation: "chatbot"
    }
  ],
  somTiles: [
    {
      id: "locations",
      title: "Locations",
      description: "Dove sono installati i sensori",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/loc/",
      icon: "map-pin",
      animation: "map"
    },
    {
      id: "infrastrutture",
      title: "Infrastrutture di Ricerca",
      description: "Le infrastrutture di ricerca che collaborano con ISMAR",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/ri/",
      icon: "network",
      animation: "infrastructure"
    },
    {
      id: "facilities",
      title: "Facilities",
      description: "Piattaforme e reti di strumenti osservativi",
      href: "./facilities.html",
      icon: "aaot",
      animation: "facilities"
    }
  ]
};
