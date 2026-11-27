/* Configurazione di collegamenti, testi e tile della home e della pagina SOM.
 * Sono accettati percorsi relativi (./som.html), assoluti (/som.html) o URL https://.
 */
window.ISMAR_PORTAL = {
  // Animazioni attive, salvo preferenze di accessibilità del visitatore.
  animations: true,
  environmentalVariables: {
    endpoint: "https://fuseki.ve.ismar.cnr.it/evsreg/query"
  },
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
      detail: "Entità e relazioni tra sensori, dati, luoghi, infrastrutture e organizzazioni",
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
      title: "Esplora le serie temporali",
      description: "Mappa delle osservazioni",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/dashboards/ts_dashboard/ts_dash.html",
      icon: "map-2",
      animation: "map"
    },
    {
      id: "dati-grigliati",
      title: "Esplora dati grigliati",
      description: "Mappa delle aree coperte dai dataset",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/dashboards/grid_dashboard/browser_dataset_grigliati.html",
      icon: "grid-3x3",
      animation: "models"
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
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/dashboards/qc_dashboard/qc_dash.html",
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
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/isabot-metadata/chatbot.html",
      icon: "chatbot",
      animation: "chatbot"
    },
    {
      id: "profiles",
      title: "Profiles",
      description: "Profili semantici delle entità",
      href: "./profiles.html",
      icon: "network",
      animation: "infrastructure"
    },
    {
      id: "otherresources",
      title: "Altre risorse",
      description: "Strumenti per lavorare con i dati",
      href: "./otherresources.html",
      icon: "toolbox",
      animation: "resources"
    },
    {
      id: "repositories",
      title: "Git repositories",
      description: "Le basi della nostra infrastruttura dati",
      href: "./repositories.html",
      icon: "git-branch",
      animation: "repositories"
    }
  ],
  somTiles: [
    {
      id: "locations",
      entity: "locations",
      title: "Locations",
      description: "Dove sono installati i sensori",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/loc/",
      icon: "map-pin",
      animation: "map"
    },
    {
      id: "infrastrutture",
      entity: "ris",
      title: "Infrastrutture di Ricerca",
      description: "Le infrastrutture di ricerca che collaborano con ISMAR",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/ri/",
      icon: "network",
      animation: "infrastructure"
    },
    {
      id: "facilities-registry",
      entity: "facilities",
      title: "Facilities",
      description: "Esplora il registro delle facilities",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/fac/",
      icon: "network",
      animation: "infrastructure"
    },
    {
      id: "facilities",
      title: "Facilities Map",
      description: "Piattaforme e reti di strumenti osservativi",
      href: "./facilities.html",
      icon: "aaot",
      animation: "facilities"
    },
    {
      id: "organizations",
      entity: "orgs",
      title: "Organizations",
      description: "Le organizzazioni del Sistema Osservativo Marino",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/org/",
      icon: "network",
      animation: "infrastructure"
    },
    {
      id: "sensor-models",
      entity: "models",
      title: "Sensor Models",
      description: "Caratteristiche tecniche dei modelli di sensore",
      href: "https://assets.ve.ismar.cnr.it/public/public_pages/sensmod/",
      icon: "grid-3x3",
      animation: "models"
    },
    {
      id: "environmental-variable",
      entity: "ev",
      title: "Environmental variable",
      description: "Le variabili ambientali osservate dai sensori",
      href: "./environmental-variables.html",
      icon: "chart-data",
      animation: "servers"
    },
    {
      id: "deployments",
      entity: "deployments",
      title: "Deployments",
      description: "I sensori effettivamente installati sul campo",
      href: "",
      icon: "radar-2",
      animation: "observatory"
    },
    {
      id: "datasets",
      entity: "datasets",
      title: "Datasets",
      description: "I dati del sistema osservativo",
      href: "",
      icon: "stack-2",
      animation: "servers"
    },
    {
      id: "features-of-interest",
      entity: "features",
      title: "Features of Interest",
      description: "Gli elementi oggetto di osservazione",
      href: "",
      icon: "map-2",
      animation: "map"
    }
  ]
};
