/* Unico file da modificare per collegamenti, testi e nuove tile.
 * I quattro percorsi sono predisposti: le pagine di destinazione NON sono
 * incluse in questa landing. Sostituire href con gli indirizzi definitivi.
 * Sono accettati percorsi relativi (./som/), assoluti (/som/) o URL https://.
 */
window.ISMAR_PORTAL = {
  // Animazioni attive, salvo preferenze di accessibilità del visitatore.
  animations: true,
  footer: {
    label: "ISMAR",
    href: "https://www.ismar.cnr.it/"
  },
  tiles: [
    {
      id: "som",
      title: "SOM",
      description: "Sistema Osservativo Marino",
      detail: "Strumenti e facilities",
      href: "./som/",
      icon: "radar-2",
      animation: "observatory"
    },
    {
      id: "server",
      title: "Data Server / API",
      description: "Accesso ai dati e alle API",
      detail: "ERDDAP · THREDDS · GeoNode · CKAN",
      href: "./server/",
      icon: "stack-2",
      animation: "servers"
    },
    {
      id: "mappa",
      title: "Esplora i dati",
      description: "Mappa delle osservazioni",
      href: "./mappa/",
      icon: "map-2",
      animation: "map"
    },
    {
      id: "modelli",
      title: "Modelli previsionali",
      description: "Risultati dei modelli per area",
      href: "./modelli/",
      icon: "grid-3x3",
      animation: "models"
    }
  ]
};
