/* Osservazioni Acqua Alta: valori reali, nessun dato simulato o proxy esterno. */
(() => {
  "use strict";
  const tiles = [...document.querySelectorAll('.tile[data-kind="dashboard"]')];
  if (!tiles.length) return;
  const config = window.ISMAR_PORTAL?.dashboard || {};
  const endpoint = config.endpoint || "https://apiapp.ve.ismar.cnr.it/api/fetch-data/?format=json";
  const refreshMs = Math.max(60000, Number(config.refreshMs) || 300000);
  const fields = ["livello", "onda_altezza_significativa", "vento_velocita", "vento_direzione"];
  const labels = ["Marea", "Onde", "Vento"];
  const units = ["m", "m", "m/s"];
  const formatter = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let state = { status: "loading", measures: {} };
  let timer = 0;
  let controller = null;
  let lastAttempt = 0;
  let active = true;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const panels = tiles.map((tile, index) => {
    const panel = element("div", "dashboard-preview");
    panel.id = `dashboard-preview-${index}`;
    panel.append(element("p", "dashboard-source", "Acqua Alta · Venezia"));
    panel.append(tile.querySelector("canvas"));
    const list = element("dl", "dashboard-metrics");
    const values = labels.map((label, i) => {
      const metric = element("div", "dashboard-metric");
      const value = element("dd", "dashboard-value");
      const number = element("span", "dashboard-number", "—");
      const unit = element("span", "dashboard-unit", units[i]);
      const description = element("span", "visually-hidden", "In attesa dei dati");
      value.append(number, unit, description);
      metric.append(element("dt", "dashboard-label", label), value);
      list.append(metric);
      return { metric, number, unit, description };
    });
    const status = element("p", "dashboard-status", "Caricamento misure…");
    status.setAttribute("role", "status");
    panel.append(list, status);
    tile.append(panel);
    tile.setAttribute("aria-describedby", panel.id);
    return { panel, values, status };
  });

  function timestamp(value) {
    if (typeof value !== "string") return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?$/.exec(value);
    if (!match) return null;
    return { raw: value, label: `${match[3]}/${match[2]}/${match[1]} · ${match[4]}:${match[5]}` };
  }

  function parse(data) {
    if (!Array.isArray(data)) throw new Error("Formato API inatteso: atteso un elenco di misure");
    const measures = {};
    for (const row of data) {
      if (!row || typeof row !== "object") continue;
      for (const [key, raw] of Object.entries(row)) {
        const name = key.split("-")[1]?.trim();
        if (!fields.includes(name)) continue;
        const text = typeof raw === "number" || typeof raw === "string" ? String(raw).trim().replace(",", ".") : "";
        let value = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) ? Number(text) : null;
        if (!Number.isFinite(value) || (name !== "livello" && value < 0) || (name === "vento_direzione" && value > 360)) value = null;
        const date = timestamp(row.timestamp);
        // In case several samples are returned, retain the newest for each field.
        if (measures[name]?.date && date && measures[name].date.raw > date.raw) continue;
        measures[name] = { value, date };
      }
    }
    if (!fields.some(name => name in measures)) throw new Error("Nessuna misura Acqua Alta riconosciuta");
    return measures;
  }

  function render() {
    for (const { panel, values, status } of panels) {
      panel.dataset.state = state.status;
      values.forEach(({ metric, number, unit, description }, i) => {
        const measure = state.measures[fields[i]];
        const available = measure?.value != null;
        const direction = state.measures.vento_direzione;
        number.textContent = available ? formatter.format(measure.value) : "—";
        unit.hidden = !available;
        metric.dataset.available = String(available);
        const details = [available ? "" : state.status === "loading" ? "In attesa dei dati" : "Dato non disponibile"];
        if (i === 2 && direction?.value != null) details.push(`Direzione di provenienza ${direction.value}°`);
        if (measure?.date) details.push(`Misura ${measure.date.label}`);
        description.textContent = details.filter(Boolean).join(". ");
        metric.title = description.textContent;
      });
      const dates = fields.map(name => state.measures[name]?.date).filter(Boolean);
      const distinct = [...new Set(dates.map(date => date.raw))];
      status.textContent = state.status === "loading" ? "Caricamento misure…" :
        state.status === "error" ? "Dati non raggiungibili" :
        distinct.length > 1 ? "Orari delle misure nei dettagli" :
        dates.length ? `Misure ${dates[0].label}` : "Orario delle misure non disponibile";
    }
    window.ISMAR_DASHBOARD = state;
    document.dispatchEvent(new CustomEvent("ismar:dashboard-update"));
  }

  function schedule() {
    clearTimeout(timer);
    if (active && !document.hidden) timer = setTimeout(refresh, Math.max(0, refreshMs - (Date.now() - lastAttempt)));
  }

  async function refresh() {
    if (controller || !active || document.hidden) return;
    lastAttempt = Date.now();
    controller = new AbortController();
    const requestController = controller;
    const timeout = setTimeout(() => requestController.abort(), 10000);
    try {
      const response = await fetch(endpoint, { signal: requestController.signal, cache: "no-store", credentials: "omit" });
      if (!response.ok) throw new Error(`API ISMAR: HTTP ${response.status}`);
      const measures = parse(await response.json());
      if (active) { state = { status: "ready", measures }; render(); }
    } catch (error) {
      if (active) {
        state = { status: "error", measures: {} };
        render();
        console.warn("Dashboard ISMAR: impossibile leggere le misure. Verificare disponibilità dell’API e CORS per questa origine.", error);
      }
    } finally {
      clearTimeout(timeout);
      controller = null;
      schedule();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(timer); else schedule();
  });
  window.addEventListener("pagehide", () => { active = false; clearTimeout(timer); controller?.abort(); });
  window.addEventListener("pageshow", () => { active = true; schedule(); });
  render();
  refresh();
})();
