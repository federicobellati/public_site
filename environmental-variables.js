(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ns = { ev: 'https://example.org/ev/', rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#', skos: 'http://www.w3.org/2004/02/skos/core#', dc: 'http://purl.org/dc/terms/' };
  // Display paths from the existing EV profile (1.0.5); no new RDF statements or classifications.
  const paths = {
    AtmosphericClimateVariable: ['Atmosphere'], SurfaceAtmosphericClimateVariable: ['Atmosphere', 'Surface'], UpperAtmosphereClimateVariable: ['Atmosphere', 'Upper Atmosphere'], AtmosphericCompositionClimateVariable: ['Atmosphere', 'Atmospheric Composition'],
    LandClimateVariable: ['Land'], HydrologicalLandClimateVariable: ['Land', 'Hydrology'], CryosphericLandClimateVariable: ['Land', 'Cryosphere'], BiologicalLandClimateVariable: ['Land', 'Biology'], HumanUseOfNaturalResourcesLandClimateVariable: ['Land', 'Human Use of Natural Resources'],
    OceanClimateVariable: ['Ocean'], PhysicalOceanClimateVariable: ['Ocean', 'Physical'], BiogeochemicalOceanClimateVariable: ['Ocean', 'Biogeochemical'], BiologicalEcosystemsOceanClimateVariable: ['Ocean', 'Biological/Ecosystems'],
    PhysicalOceanVariable: ['Physics'], BiogeochemicalOceanVariable: ['Biogeochemistry'], BiologicalEcosystemsOceanVariable: ['Biology and Ecosystems'],
    GeneticCompositionBiodiversityVariable: ['Genetic composition'], SpeciesPopulationsBiodiversityVariable: ['Species populations'], SpeciesTraitsBiodiversityVariable: ['Species traits'], CommunityCompositionBiodiversityVariable: ['Community composition'], EcosystemFunctioningBiodiversityVariable: ['Ecosystem functioning'], EcosystemStructureBiodiversityVariable: ['Ecosystem structure']
  };
  const frameworks = {
    ECV: { scheme: ns.ev + 'ecv-scheme', title: 'Essential Climate Variables', type: ns.ev + 'EssentialClimateVariable' },
    EOV: { scheme: ns.ev + 'eov-scheme', title: 'Essential Ocean Variables', type: ns.ev + 'EssentialOceanVariable' },
    EBV: { scheme: ns.ev + 'ebv-scheme', title: 'Essential Biodiversity Variables', type: ns.ev + 'EssentialBiodiversityVariable' }
  };
  const query = `SELECT DISTINCT ?s ?p ?o WHERE { ?s <${ns.skos}inScheme> ?scheme ; ?p ?o . VALUES ?scheme { ${Object.values(frameworks).map(f => '<' + f.scheme + '>').join(' ')} } FILTER(isIRI(?s)) }`;
  let records = [], framework = '', selected = '', downloadURL, request;
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en');
  const tail = iri => iri.split(/[/#]/).pop() || iri;
  const values = (record, predicate) => record.triples.filter(t => t.p.value === predicate).map(t => t.o);
  const preferred = terms => (terms.find(t => t['xml:lang'] === 'en') || terms.find(t => !t['xml:lang']) || terms[0])?.value;
  const categoryName = iri => iri.startsWith(ns.ev) && paths[tail(iri)] ? paths[tail(iri)].join(' / ') : tail(iri);
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function link(iri, label) {
    let valid = false;
    try { valid = ['https:', 'http:'].includes(new URL(iri).protocol); } catch { /* Non-URLs stay plain text. */ }
    const node = element(valid ? 'a' : 'span', label || iri);
    if (valid) { node.href = iri; node.target = '_blank'; node.rel = 'noopener noreferrer'; }
    return node;
  }
  function badge(code) { const node = element('span', code, 'ev-badge'); node.dataset.framework = code; return node; }
  function parseRecords(bindings) {
    const grouped = new Map();
    for (const row of bindings) {
      if (row.s?.type !== 'uri' || row.p?.type !== 'uri' || !row.o) continue;
      if (!grouped.has(row.s.value)) grouped.set(row.s.value, { iri: row.s.value, triples: [] });
      grouped.get(row.s.value).triples.push(row);
    }
    return [...grouped.values()].flatMap(record => {
      const schemes = values(record, ns.skos + 'inScheme').map(t => t.value);
      record.frameworks = Object.keys(frameworks).filter(code => schemes.includes(frameworks[code].scheme));
      if (!record.frameworks.length) return [];
      record.name = preferred(values(record, ns.skos + 'prefLabel')) || tail(record.iri);
      record.categories = values(record, ns.rdf + 'type').filter(t => t.type === 'uri' && ![ns.ev + 'EssentialVariable', ns.skos + 'Concept', ...Object.values(frameworks).map(f => f.type)].includes(t.value)).map(t => t.value);
      // Show the most specific declared categories; their full paths retain the parent level.
      record.paths = [...new Set(record.categories.map(categoryName))].filter(path => !record.categories.some(iri => categoryName(iri).startsWith(path + ' / ')));
      record.description = preferred(values(record, ns.dc + 'description'));
      record.search = normalize([record.name, record.iri, ...record.frameworks, ...record.frameworks.map(f => frameworks[f].title), ...record.categories.map(categoryName), ...record.triples.map(t => t.o.value)].join(' '));
      return [record];
    }).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.iri.localeCompare(b.iri));
  }
  function renderCategories() {
    const previous = $('category').value;
    const options = [...new Set(records.filter(r => !framework || r.frameworks.includes(framework)).flatMap(r => r.categories))].sort((a, b) => categoryName(a).localeCompare(categoryName(b), 'en'));
    const all = element('option', 'Tutte le classificazioni'); all.value = '';
    $('category').replaceChildren(all, ...options.map(iri => { const node = element('option', categoryName(iri)); node.value = iri; return node; }));
    $('category').value = options.includes(previous) ? previous : '';
  }
  function renderList() {
    const search = normalize($('search').value.trim()), category = $('category').value;
    const visible = records.filter(r => (!framework || r.frameworks.includes(framework)) && (!category || r.categories.includes(category)) && r.search.includes(search));
    $('status').textContent = `${visible.length} variabili${framework || category || search ? ' su ' + records.length : ' nel registry'}`;
    $('clear-filters').hidden = !framework && !category && !search;
    $('empty').hidden = visible.length > 0 || records.length === 0;
    $('variables').replaceChildren(...visible.map(record => {
      const item = element('li'), button = element('button', undefined, 'ev-row'); button.type = 'button';
      button.setAttribute('aria-pressed', String(record.iri === selected)); button.setAttribute('aria-controls', 'detail');
      const badges = element('span'); badges.append(...record.frameworks.map(badge));
      const copy = element('span'); copy.append(element('strong', record.name), element('small', record.paths.join(' · ') || 'Classificazione non dichiarata'));
      const arrow = element('span', '↗', 'ev-row-arrow'); arrow.setAttribute('aria-hidden', 'true');
      button.append(badges, copy, arrow);
      button.addEventListener('click', () => { const url = new URL(location.href); url.searchParams.set('id', record.iri); history.pushState(null, '', url); showRecord(record.iri, true); renderList(); });
      item.append(button); return item;
    }));
  }
  function rdfTerm(term) {
    if (term.type === 'uri') {
      if (/[<>"{}|^`\\\x00-\x20]/u.test(term.value)) throw new Error('IRI non serializzabile.');
      return '<' + term.value + '>';
    }
    if (term.type === 'bnode') return '_:' + term.value;
    return JSON.stringify(term.value) + (term['xml:lang'] ? '@' + term['xml:lang'] : term.datatype ? '^^' + rdfTerm({ type: 'uri', value: term.datatype }) : '');
  }
  function showRecord(iri, focus = false) {
    selected = iri;
    if (downloadURL) { URL.revokeObjectURL(downloadURL); downloadURL = undefined; }
    const panel = $('detail'), record = records.find(r => r.iri === iri);
    panel.replaceChildren(element('p', 'SCHEDA DELLA VARIABILE', 'ev-eyebrow'));
    const title = element('h2', record?.name || (iri ? 'Variabile non trovata' : 'Scegli una variabile')); title.id = 'detail-title'; title.tabIndex = -1; panel.append(title);
    if (!record) { panel.append(element('p', iri ? 'La variabile richiesta non è presente nel registry attuale.' : 'Apri una voce per consultarne la classificazione, le annotazioni e le fonti.', 'ev-placeholder')); return; }
    panel.append(...record.frameworks.map(badge));
    for (const code of record.frameworks) panel.append(element('p', frameworks[code].title));
    panel.append(element('h3', 'Classificazione del profilo'));
    const categories = element('ul'); for (const path of record.paths) categories.append(element('li', path));
    panel.append(record.paths.length ? categories : element('p', 'Non dichiarata.'));
    const subjects = values(record, ns.dc + 'subject');
    if (subjects.length) { panel.append(element('h3', 'Ambito / tema')); for (const term of subjects) panel.append(element('p', term.value)); }
    if (record.description) { panel.append(element('h3', 'Annotazioni del registry'), element('p', record.description)); }
    panel.append(element('h3', 'Fonti di riferimento'));
    const sources = values(record, ns.dc + 'source'), sourceList = element('ul');
    for (const term of sources) { const item = element('li'); item.append(link(term.value)); sourceList.append(item); }
    panel.append(sources.length ? sourceList : element('p', 'Nessuna fonte dichiarata.'));
    panel.append(element('h3', 'Identificativo della variabile'));
    const identity = link(record.iri); identity.className = 'ev-iri'; panel.append(identity);
    // N-Triples is also valid Turtle; preserve every triple returned for this subject.
    const turtle = record.triples.map(t => `${rdfTerm(t.s)} ${rdfTerm(t.p)} ${rdfTerm(t.o)} .`).join('\n') + '\n';
    downloadURL = URL.createObjectURL(new Blob([turtle], { type: 'text/turtle;charset=utf-8' }));
    const download = element('a', 'Scarica RDF (.ttl)', 'ev-button'); download.href = downloadURL; download.download = tail(record.iri).replace(/[^a-z0-9_-]/gi, '_') + '.ttl'; panel.append(download);
    const details = element('details'), summary = element('summary', 'Descrizione semantica'), pre = element('pre'), code = element('code', turtle); pre.tabIndex = 0; pre.append(code); details.append(summary, pre); panel.append(details);
    if (focus) { title.focus({ preventScroll: true }); if (matchMedia('(max-width: 850px)').matches) panel.scrollIntoView({ behavior: 'instant', block: 'start' }); }
  }
  function setFramework(code) {
    framework = code;
    document.querySelectorAll('[data-framework]').forEach(button => { if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.framework === code)); });
    renderCategories(); renderList();
  }
  async function load() {
    if (request) request.abort();
    const controller = new AbortController(); request = controller;
    $('catalogue').setAttribute('aria-busy', 'true'); $('error').hidden = true; $('status').textContent = 'Caricamento del registry…';
    $('refresh').disabled = true; $('retry').disabled = true;
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const url = new URL(window.ISMAR_PORTAL.environmentalVariables.endpoint); url.searchParams.set('query', query);
      const response = await fetch(url, { headers: { Accept: 'application/sparql-results+json' }, credentials: 'omit', cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('Il servizio ha risposto con HTTP ' + response.status + '.');
      const data = await response.json();
      if (!Array.isArray(data.results?.bindings)) throw new Error('Il servizio ha restituito un formato inatteso.');
      if (request !== controller) return;
      records = parseRecords(data.results.bindings);
      $('total-count').textContent = records.length;
      document.querySelectorAll('[data-count]').forEach(node => { node.textContent = node.dataset.count === 'all' ? records.length : records.filter(r => r.frameworks.includes(node.dataset.count)).length; });
      $('search').disabled = $('category').disabled = false;
      document.querySelectorAll('#frameworks button').forEach(button => { button.disabled = false; });
      renderCategories(); renderList(); showRecord(new URLSearchParams(location.search).get('id') || selected);
      if (!records.length) { $('empty').hidden = false; $('empty').querySelector('p').textContent = 'Il registry non contiene ancora variabili ECV, EOV o EBV.'; }
    } catch (error) {
      if (request !== controller) return;
      records = []; $('variables').replaceChildren(); $('empty').hidden = true; $('total-count').textContent = '—';
      document.querySelectorAll('[data-count]').forEach(node => { node.textContent = '—'; });
      $('search').disabled = $('category').disabled = true;
      document.querySelectorAll('#frameworks button').forEach(button => { button.disabled = true; });
      showRecord(''); $('error').hidden = false; $('status').textContent = 'Dati non disponibili.';
      $('error-message').textContent = error.name === 'AbortError' ? 'Il servizio non ha risposto entro 30 secondi.' : error.message === 'Failed to fetch' ? 'Impossibile contattare il servizio. Verifica la connessione e riprova.' : error.message;
    } finally { clearTimeout(timeout); if (request === controller) { $('catalogue').setAttribute('aria-busy', 'false'); $('refresh').disabled = $('retry').disabled = false; } }
  }
  document.querySelectorAll('#frameworks button').forEach(button => button.addEventListener('click', () => setFramework(button.dataset.framework)));
  $('search').addEventListener('input', renderList); $('category').addEventListener('change', renderList);
  $('clear-filters').addEventListener('click', () => { $('search').value = ''; $('category').value = ''; setFramework(''); });
  $('refresh').addEventListener('click', load); $('retry').addEventListener('click', load);
  addEventListener('popstate', () => { showRecord(new URLSearchParams(location.search).get('id') || ''); renderList(); });
  load();
})();
