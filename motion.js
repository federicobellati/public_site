/* Diagrammi illustrativi animati: non rappresentano misure o stati reali.
 * Un solo ciclo, limitato a 30 fps, si ferma fuori schermo o in background.
 */
(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.getElementById("motion-toggle");
  const storageKey = "ismar-portal-motion";
  const indigo = "#92a7e2";
  const aqua = "#84e9d6";
  let preference = null;
  try { preference = localStorage.getItem(storageKey); } catch { /* Storage can be unavailable on file://. */ }
  let running = preference === "off" ? false : preference === "on" ? true : !reducedMotion.matches;
  if (window.ISMAR_PORTAL?.animations === false) running = false;
  let raf = 0;
  let previous = 0;
  let elapsed = 0;

  const scenes = [...document.querySelectorAll(".tile")].map(tile => {
    const canvas = tile.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    return { tile, canvas, ctx, kind: tile.dataset.kind, visible: true, active: false, width: 0, height: 0 };
  }).filter(scene => scene.ctx);

  function stroke(ctx, color = indigo, alpha = .65, width = 1.2) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function dot(ctx, x, y, radius = 3, color = aqua, alpha = 1) {
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function ring(ctx, x, y, radius, alpha = .7) {
    stroke(ctx, aqua, alpha, 1);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  function bezier(p0, p1, p2, p3, t) {
    const s = 1 - t;
    return s * s * s * p0 + 3 * s * s * t * p1 + 3 * s * t * t * p2 + t * t * t * p3;
  }

  function observatory(ctx, t, active) {
    for (let wave = 0; wave < 3; wave++) {
      stroke(ctx, indigo, .28 + wave * .08, 1);
      ctx.beginPath();
      for (let x = 205; x <= 650; x += 4) {
        const y = 144 + wave * 18 + Math.sin(x / 50 + t * .6 + wave * .9) * 8;
        if (x === 205) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    const stations = [{x:285,y:112},{x:433,y:69},{x:574,y:111}];
    stroke(ctx, indigo, .58, 1.2);
    ctx.setLineDash([3, 6]);
    ctx.lineDashOffset = -t * 9;
    ctx.beginPath();
    ctx.moveTo(stations[0].x, stations[0].y);
    ctx.quadraticCurveTo(345, 33, stations[1].x, stations[1].y);
    ctx.quadraticCurveTo(510, 53, stations[2].x, stations[2].y);
    ctx.stroke();
    ctx.setLineDash([]);
    stations.forEach((p, i) => {
      const phase = (t * .27 + i * .31) % 1;
      stroke(ctx, "#d4e9e7", .8, 1.5);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 7); ctx.lineTo(p.x, p.y + 24);
      ctx.moveTo(p.x - 10, p.y + 25); ctx.lineTo(p.x + 10, p.y + 25);
      ctx.stroke();
      dot(ctx, p.x, p.y, i === 1 ? 4 : 3, i === 1 ? aqua : indigo);
      ring(ctx, p.x, p.y, 8 + phase * 19, (1 - phase) * (active ? .8 : .5));
      ring(ctx, p.x, p.y, 6, .5);
    });
  }

  function servers(ctx, t, active) {
    for (let i = 0; i < 4; i++) {
      const y = 38 + i * 37;
      stroke(ctx, indigo, active ? .85 : .7, 1.35);
      ctx.beginPath();
      ctx.moveTo(268, 108);
      ctx.bezierCurveTo(418, 108, 380, y, 598, y);
      ctx.stroke();
      const p = (t * .12 + i * .23) % 1;
      dot(ctx, bezier(268, 418, 380, 598, p), bezier(108, 108, y, y, p), 2.7, aqua, active ? 1 : .8);
      stroke(ctx, "#c3d8ef", .9, 1.6);
      ctx.beginPath(); ctx.arc(598, y, 5, 0, Math.PI * 2); ctx.stroke();
    }
    ring(ctx, 268, 108, 5.5, .9);
  }

  function map(ctx, t, active, viewportHeight = 200) {
    const geography = window.ISMAR_GEOGRAPHY;
    if (!geography) return;
    const [west, south, east, north] = geography.bounds;
    const box = { x: 200, y: 12, width: 427, height: Math.min(235, viewportHeight - 24) };
    const longitudeScale = Math.cos((south + north) / 2 * Math.PI / 180);
    const scale = Math.min(box.width / ((east - west) * longitudeScale), box.height / (north - south));
    const mapWidth = (east - west) * longitudeScale * scale;
    const mapHeight = (north - south) * scale;
    const left = box.x + (box.width - mapWidth) / 2;
    const top = box.y + (box.height - mapHeight) / 2;
    const project = ([lon, lat]) => [left + (lon - west) * longitudeScale * scale, top + (north - lat) * scale];

    ctx.save();
    ctx.beginPath(); ctx.rect(left, top, mapWidth, mapHeight); ctx.clip();
    // Actual coastlines, a quiet graticule, and illustrative observation points.
    stroke(ctx, indigo, .15, .7);
    ctx.setLineDash([2, 5]);
    for (let lon = -5; lon <= 30; lon += 5) {
      const [x] = project([lon, south]);
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, top + mapHeight); ctx.stroke();
    }
    for (let lat = 35; lat <= 45; lat += 5) {
      const [, y] = project([west, lat]);
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + mapWidth, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const polygon of geography.land) {
      ctx.beginPath();
      polygon.forEach((coordinate, i) => {
        const [x, y] = project(coordinate);
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.globalAlpha = .12;
      ctx.fillStyle = indigo;
      ctx.fill();
      // Do not draw the artificial straight edges introduced by the crop.
      ctx.beginPath();
      polygon.forEach((coordinate, i) => {
        const previous = polygon[(i + polygon.length - 1) % polygon.length];
        const frameEdge = [west, east].some(lon => coordinate[0] === lon && previous[0] === lon) ||
          [south, north].some(lat => coordinate[1] === lat && previous[1] === lat);
        if (frameEdge) return;
        const [x0,y0] = project(previous), [x1,y1] = project(coordinate);
        ctx.moveTo(x0,y0); ctx.lineTo(x1,y1);
      });
      stroke(ctx, indigo, active ? .8 : .65, 1.1);
      ctx.stroke();
    }

    // These positions illustrate navigation; they are not a live station catalogue.
    const observations = [[4,40],[8,42],[12,39],[15.2,43.2],[18,40.1],[21.5,35.5],[1.5,37.5],[14.2,35.3]];
    const selected = Math.floor(t / 2.4) % observations.length;
    observations.forEach((coordinate, i) => {
      const [x, y] = project(coordinate);
      const phase = (t * .35 + i * .19) % 1;
      dot(ctx, x, y, i === selected ? 3.2 : 2.3, aqua, i === selected ? 1 : .72);
      ring(ctx, x, y, 4 + phase * 8, (1 - phase) * (i === selected ? .85 : .25));
    });
    const [x, y] = project(observations[selected]);
    stroke(ctx, aqua, active ? .95 : .7, 1);
    const size = 8;
    for (const [dx,dy] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {
      ctx.beginPath();
      ctx.moveTo(x + dx * size, y + dy * (size - 3));
      ctx.lineTo(x + dx * size, y + dy * size);
      ctx.lineTo(x + dx * (size - 3), y + dy * size);
      ctx.stroke();
    }
    ctx.restore();
  }

  function models(ctx, t, active) {
    stroke(ctx, indigo, .13, .8);
    for (let x = 252; x < 645; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 15); ctx.lineTo(x, 197); ctx.stroke();
    }
    for (let y = 20; y < 200; y += 24) {
      ctx.beginPath(); ctx.moveTo(250, y); ctx.lineTo(640, y); ctx.stroke();
    }
    const boxes = [{x:322,y:38,w:137,h:84},{x:444,y:86,w:127,h:71},{x:401,y:133,w:95,h:43}];
    boxes.forEach((b, i) => {
      stroke(ctx, indigo, .72, 1.3);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      const p = (t * .12 + i * .31) % 1;
      const distance = p * (b.w + b.h) * 2;
      let x, y;
      if (distance < b.w) { x = b.x + distance; y = b.y; }
      else if (distance < b.w + b.h) { x = b.x + b.w; y = b.y + distance - b.w; }
      else if (distance < b.w * 2 + b.h) { x = b.x + b.w - (distance - b.w - b.h); y = b.y + b.h; }
      else { x = b.x; y = b.y + b.h - (distance - b.w * 2 - b.h); }
      dot(ctx, x, y, active ? 3 : 2.4, aqua, .95);
    });
  }

  const draw = { observatory, servers, map, models };

  function paint(scene, time) {
    const { ctx, canvas, width, height } = scene;
    if (!width || !height) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const horizontalScale = canvas.width / 640;
    // Geography keeps the same x/y scale at every responsive breakpoint.
    ctx.scale(horizontalScale, scene.kind === "map" ? horizontalScale : canvas.height / 200);
    draw[scene.kind](ctx, time, scene.active, scene.height / scene.width * 640);
    ctx.restore();
  }

  function resize(scene) {
    const rect = scene.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    scene.width = rect.width;
    scene.height = rect.height;
    scene.canvas.width = Math.round(rect.width * dpr);
    scene.canvas.height = Math.round(rect.height * dpr);
    paint(scene, elapsed);
  }

  function shouldAnimate() { return running && !document.hidden && scenes.some(s => s.visible); }

  function frame(now) {
    raf = 0;
    if (!shouldAnimate()) { previous = 0; return; }
    if (!previous) previous = now;
    if (now - previous >= 1000 / 30) {
      elapsed += Math.min((now - previous) / 1000, .1);
      previous = now;
      scenes.forEach(scene => { if (scene.visible) paint(scene, elapsed); });
    }
    raf = requestAnimationFrame(frame);
  }

  function sync() {
    document.body.classList.toggle("motion-paused", !running);
    toggle.setAttribute("aria-pressed", String(running));
    toggle.setAttribute("aria-label", running ? "Metti in pausa le animazioni" : "Attiva le animazioni");
    toggle.querySelector("span").textContent = running ? "Animazioni attive" : "Animazioni in pausa";
    toggle.querySelector("img").src = `assets/icons/player-${running ? "pause" : "play"}.svg`;
    if (shouldAnimate() && !raf) raf = requestAnimationFrame(frame);
    if (!shouldAnimate()) {
      cancelAnimationFrame(raf); raf = 0; previous = 0;
    }
  }

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const scene = scenes.find(s => s.canvas === entry.target);
      if (scene) resize(scene);
    }
  });
  const intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const scene = scenes.find(s => s.tile === entry.target);
      if (scene) scene.visible = entry.isIntersecting;
    });
    sync();
  }, { threshold: .05 });

  scenes.forEach(scene => {
    resizeObserver.observe(scene.canvas);
    intersectionObserver.observe(scene.tile);
    scene.tile.addEventListener("pointerenter", () => { scene.active = true; if (!running) paint(scene, elapsed); });
    scene.tile.addEventListener("pointerleave", () => { scene.active = false; scene.canvas.style.transform = ""; if (!running) paint(scene, elapsed); });
    scene.tile.addEventListener("focus", () => { scene.active = true; if (!running) paint(scene, elapsed); });
    scene.tile.addEventListener("blur", () => { scene.active = false; if (!running) paint(scene, elapsed); });
    scene.tile.addEventListener("pointermove", event => {
      if (!running || reducedMotion.matches || event.pointerType === "touch") return;
      const rect = scene.tile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      scene.canvas.style.transform = `translate(${x * 10}px, ${y * 6}px)`;
    }, { passive: true });
  });

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    running = !running;
    preference = running ? "on" : "off";
    try { localStorage.setItem(storageKey, preference); } catch { /* Preference is still valid for this visit. */ }
    sync();
  });
  reducedMotion.addEventListener("change", () => {
    if (preference === null) {
      running = !reducedMotion.matches && window.ISMAR_PORTAL?.animations !== false;
      sync();
    }
  });
  document.addEventListener("visibilitychange", sync);
  sync();
})();
