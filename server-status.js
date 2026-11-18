/* Un solo GET per servizio all'apertura della pagina. Gli errori che il browser
 * non permette di interpretare (CORS, rete, contenuti HTTP) restano grigi. */
(() => {
  document.querySelectorAll('.server-card').forEach(async (card) => {
    const dot = document.createElement('span');
    dot.className = 'server-status';
    dot.setAttribute('role', 'img');
    dot.setAttribute('aria-label', 'Stato non verificabile');
    card.querySelector('.server-title').prepend(dot);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(card.dataset.statusUrl || card.href, {
        method: 'GET',
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal
      });
      dot.dataset.state = response.ok ? 'green' : 'red';
      dot.setAttribute('aria-label', response.ok ? 'Servizio raggiungibile' : 'Il servizio ha restituito un errore');
      // Bastano le intestazioni: interrompiamo il download del contenuto.
      if (response.body) response.body.cancel().catch(() => {});
    } catch (error) {
      if (error.name === 'AbortError' && navigator.onLine) {
        dot.dataset.state = 'red';
        dot.setAttribute('aria-label', 'Nessuna risposta entro 5 secondi');
      }
    } finally {
      clearTimeout(timer);
    }
  });
})();
