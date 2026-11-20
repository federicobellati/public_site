(() => {
  'use strict';
  const stage = document.getElementById('map-stage');
  if (!stage) return;
  // Titoli e destinazioni sono condivisi con le tile, compresi gli href vuoti.
  const entities = Object.fromEntries((window.ISMAR_PORTAL?.somTiles || []).filter(item => item.entity).map(item => [item.entity, item]));
  const layout = {
    models: { x:65, y:45, w:270, h:140 },
    ev: { x:435, y:16, w:310, h:152 },
    ris: { x:850, y:36, w:255, h:162, description:'Collaborazioni e reti di ricerca' },
    datasets: { x:445, y:225, w:320, h:145 },
    deployments: { x:65, y:340, w:270, h:136 },
    facilities: { x:850, y:360, w:270, h:136, icon:'aaot', description:'Piattaforme e infrastrutture per l’osservazione' },
    orgs: { x:1100, y:215, w:205, h:128, description:'Le organizzazioni del SOM' },
    locations: { x:480, y:478, w:250, h:114 },
    features: { x:65, y:520, w:315, h:112 }
  };
  // Relazioni non direzionali dello schizzo; piano di riferimento 1320 × 660.
  const edges = [
    { a:'models', b:'datasets', points:[[200,185],[200,212],[402,212],[402,270],[445,270]] },
    { a:'ev', b:'datasets', points:[[590,168],[590,225]] },
    { a:'ris', b:'datasets', points:[[850,114],[815,114],[815,264],[765,264]] },
    { a:'datasets', b:'deployments', points:[[445,330],[390,330],[390,390],[335,390]] },
    { a:'datasets', b:'facilities', points:[[765,330],[805,330],[805,405],[850,405]] },
    { a:'deployments', b:'locations', points:[[200,476],[200,500],[445,500],[445,535],[480,535]] },
    { a:'deployments', b:'features', points:[[110,476],[110,496],[35,496],[35,576],[65,576]] },
    { a:'facilities', b:'locations', points:[[985,496],[985,535],[730,535]] },
    { a:'facilities', b:'orgs', points:[[1120,405],[1202,405],[1202,343]] },
    { a:'ris', b:'orgs', points:[[1105,142],[1202,142],[1202,215]] },
    { a:'ris', b:'locations', points:[[1105,80],[1310,80],[1310,620],[770,620],[770,566],[730,566]] }
  ];
  const canvas = document.getElementById('connections');
  const ctx = canvas.getContext('2d');
  const mapPanel = document.getElementById('map-panel');
  const listPanel = document.getElementById('tiles');
  const mapContent = document.getElementById('map-content');
  const mapButton = document.getElementById('map-view');
  const listButton = document.getElementById('list-view');
  const reset = document.getElementById('reset-selection');
  const motionToggle = document.getElementById('motion-toggle');
  const main = document.getElementById('contenuto');
  let selected = null;
  let mobileCentered = false;
  const neighbours = id => edges.filter(e => e.a === id || e.b === id).map(e => e.a === id ? e.b : e.a);
  function destination(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try { return ['https:', 'http:', 'file:'].includes(new URL(value, document.baseURI).protocol) ? value : null; }
    catch { return null; }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  Object.entries(layout).forEach(([id, position]) => {
    const item = entities[id];
    if (!item) return;
    const card = element('div', `entity${id === 'datasets' ? ' entity-central' : ''}`);
    card.dataset.id = id;
    ['x','y','w','h'].forEach(key => card.style.setProperty(`--${key}`, position[key]));
    const selectButton = element('button', 'entity-select');
    selectButton.type = 'button';
    selectButton.setAttribute('aria-pressed', 'false');
    selectButton.setAttribute('aria-label', `Evidenzia le relazioni di ${item.title}`);
    selectButton.append(element('span', 'entity-title', item.title), element('span', 'entity-description', position.description || item.description));
    selectButton.addEventListener('click', () => select(selected === id ? null : id));
    const href = destination(item.href);
    const detail = element(href ? 'a' : 'button', 'entity-link');
    if (href) {
      detail.href = href;
      if (item.newTab) { detail.target = '_blank'; detail.rel = 'noopener noreferrer'; }
    } else { detail.type = 'button'; detail.disabled = true; }
    detail.title = href ? `Apri ${item.title}` : `${item.title}: pagina di dettaglio in preparazione`;
    detail.setAttribute('aria-label', detail.title);
    const icon = element('img', '');
    const iconName = position.icon || item.icon;
    icon.src = `assets/icons/${/^[a-z0-9-]+$/.test(iconName) ? iconName : 'stack-2'}.svg`;
    icon.alt = ''; icon.width = icon.height = 24;
    detail.append(icon);
    card.append(selectButton, detail);
    stage.append(card);
  });

  function draw() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !ctx) return;
    if (!mobileCentered && mapPanel.scrollWidth > mapPanel.clientWidth) {
      center(selected || 'datasets'); mobileCentered = true;
    }
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * density);
    canvas.height = Math.round(rect.height * density);
    ctx.setTransform(canvas.width / 1320, 0, 0, canvas.height / 660, 0, 0);
    ctx.clearRect(0, 0, 1320, 660);
    const ordered = [...edges].sort((a,b) => Number(a.a === selected || a.b === selected) - Number(b.a === selected || b.b === selected));
    ordered.forEach(edge => {
      const active = selected && (edge.a === selected || edge.b === selected);
      ctx.strokeStyle = selected ? (active ? '#79e1d0' : '#28535e') : '#6b9a9f';
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const points = edge.points;
      ctx.beginPath(); ctx.moveTo(...points[0]);
      for (let i=1; i<points.length-1; i++) {
        const prev=points[i-1], current=points[i], next=points[i+1];
        const radius = Math.min(15, Math.hypot(current[0]-prev[0],current[1]-prev[1])/2, Math.hypot(next[0]-current[0],next[1]-current[1])/2);
        ctx.arcTo(...current,...next,radius);
      }
      ctx.lineTo(...points.at(-1)); ctx.stroke();
      [points[0],points.at(-1)].forEach(p => {
        ctx.fillStyle=ctx.strokeStyle; ctx.beginPath(); ctx.arc(...p,active?3.5:2.5,0,Math.PI*2); ctx.fill();
      });
    });
  }
  function center(id) {
    const node = stage.querySelector(`[data-id="${id}"]`);
    if (node) mapPanel.scrollLeft = node.offsetLeft + node.offsetWidth / 2 - mapPanel.clientWidth / 2;
  }
  function chip(id) {
    const button = element('button', 'relation-chip', entities[id].title);
    button.type = 'button';
    button.setAttribute('aria-label', `Esplora ${entities[id].title}`);
    button.addEventListener('click', () => select(id));
    return button;
  }
  function select(id) {
    selected = id;
    if (id && mapPanel.scrollWidth > mapPanel.clientWidth) center(id);
    const related = id ? neighbours(id) : [];
    stage.querySelectorAll('.entity').forEach(card => {
      const current = card.dataset.id;
      card.querySelector('.entity-select').setAttribute('aria-pressed', String(current === id));
      card.classList.toggle('is-selected', current === id);
      card.classList.toggle('is-muted', !!id && current !== id && !related.includes(current));
      card.classList.toggle('is-related', related.includes(current));
    });
    reset.disabled = !id;
    const detail = id ? entities[id] : null;
    document.getElementById('detail-eyebrow').textContent = id ? `${related.length} RELAZION${related.length===1?'E':'I'} NEL SISTEMA` : 'ESPLORA IL SISTEMA';
    document.getElementById('detail-title').textContent = detail?.title || 'Tutto il SOM, in una sola vista.';
    document.getElementById('detail-description').textContent = detail?.description || 'Dai dati alle piattaforme, dai luoghi alle organizzazioni: seleziona un nodo della mappa per vedere come si collega al resto del sistema.';
    document.getElementById('detail-relations').replaceChildren(...related.map(chip));
    const link = document.getElementById('detail-link');
    const href = destination(detail?.href);
    link.hidden = !href;
    if (href) { link.href = href; link.textContent = `Apri ${detail.title}`; }
    else link.removeAttribute('href');
    document.getElementById('detail-unavailable').hidden = !detail || !!href;
    draw();
  }
  function setView(list) {
    mapContent.hidden = list; listPanel.hidden = !list;
    main.classList.toggle('som-list-view', list);
    mapButton.setAttribute('aria-pressed', String(!list));
    listButton.setAttribute('aria-pressed', String(list));
    document.getElementById('som-intro').textContent = list ? 'Esplora le locations dei sensori, le infrastrutture di ricerca che collaborano con ISMAR, le facilities e le organizzazioni.' : 'Le entità del sistema, le relazioni che le connettono.';
    // Le animazioni e il loro comando appartengono alle tile della vista Elenco.
    if (motionToggle) motionToggle.hidden = !list;
    if (!list) draw();
  }
  document.getElementById('view-controls').hidden = false;
  mapButton.addEventListener('click', () => setView(false));
  listButton.addEventListener('click', () => setView(true));
  reset.addEventListener('click', () => select(null));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mapContent.hidden) select(null); });
  new ResizeObserver(draw).observe(stage);
  setView(false);
})();
