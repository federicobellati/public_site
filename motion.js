/* Diagrammi illustrativi animati; Dashboard usa le misure reali dell'API ISMAR.
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

  const scenes = [...document.querySelectorAll(".tile[data-kind]")].map(tile => {
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

  // Three compact instruments, aligned with the accessible HTML measurements.
  function dashboard(ctx, t, active, width, height) {
    const scale = Math.min(1, height / 38);
    ctx.scale(scale, scale);
    width /= scale;
    height /= scale;
    const measures = window.ISMAR_DASHBOARD?.measures || {};
    const level = measures.livello?.value;
    const wave = measures.onda_altezza_significativa?.value;
    const wind = measures.vento_velocita?.value;
    const direction = measures.vento_direzione?.value;
    const cy = height / 2;
    const centers = [width / 6, width / 2, width * 5 / 6];
    const bright = active ? 1 : .85;

    // The gauge follows the measured level; ripples only suggest the surface.
    const x = centers[0];
    stroke(ctx, indigo, .65, 1.2);
    ctx.beginPath(); ctx.moveTo(x - 21, cy - 14); ctx.lineTo(x - 21, cy + 14);
    for (let tick = -12; tick <= 12; tick += 6) {
      ctx.moveTo(x - 21, cy + tick); ctx.lineTo(x - 17, cy + tick);
    }
    ctx.stroke();
    const surface = cy + (level == null ? 0 : 5 - Math.max(-1, Math.min(2, level)) * 7);
    stroke(ctx, level == null ? indigo : aqua, level == null ? .4 : bright, 1.7);
    if (level == null) ctx.setLineDash([3, 4]);
    ctx.beginPath();
    for (let dx = -12; dx <= 23; dx++) {
      const y = surface + (level == null ? 0 : Math.sin(dx / 7 - t * 1.1) * 1.6);
      if (dx === -12) ctx.moveTo(x + dx, y); else ctx.lineTo(x + dx, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // A missing wave measurement gets a quiet dashed line, never a fake value.
    const amplitude = wave == null ? 0 : Math.min(10, Math.max(1, wave * 5));
    for (let row = 0; row < 2; row++) {
      stroke(ctx, wave == null ? indigo : row ? indigo : aqua, wave == null ? .4 : row ? .55 : bright, 1.6);
      if (wave == null) ctx.setLineDash([3, 4]);
      ctx.beginPath();
      for (let dx = -24; dx <= 24; dx++) {
        const y = cy - 4 + row * 10 + Math.sin(dx / 8 - t * 1.7 + row * .7) * amplitude;
        if (dx === -24) ctx.moveTo(centers[1] + dx, y); else ctx.lineTo(centers[1] + dx, y);
      }
      ctx.stroke(); ctx.setLineDash([]);
    }

    // Meteorological bearing: 0° points north, 90° east (wind provenance).
    const wx = centers[2];
    stroke(ctx, indigo, .55, 1);
    ctx.beginPath(); ctx.arc(wx, cy, 13, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wx, cy - 17); ctx.lineTo(wx, cy - 14); ctx.stroke();
    if (direction != null) {
      ctx.save(); ctx.translate(wx, cy); ctx.rotate(direction * Math.PI / 180);
      stroke(ctx, aqua, bright, 1.6);
      ctx.beginPath(); ctx.moveTo(0, 9); ctx.lineTo(0, -10);
      ctx.moveTo(-4, -5); ctx.lineTo(0, -10); ctx.lineTo(4, -5); ctx.stroke();
      if (wind != null && wind > 0) {
        const phase = (t * Math.min(1.3, wind / 12)) % 1;
        dot(ctx, 0, -24 + phase * 9, 1.7, aqua, (1 - phase) * .7);
      }
      ctx.restore();
    } else {
      stroke(ctx, indigo, .4, 1.5);
      ctx.beginPath(); ctx.moveTo(wx - 4, cy); ctx.lineTo(wx + 4, cy); ctx.stroke();
    }
  }

  // A federation of research hubs, drawn as floating hexagonal modules.
  // Its geometry and travelling packets are independent of the SOM stations.
  function infrastructure(ctx, t, active) {
    const hubs = [
      { x: 265, y: 64, r: 26 }, { x: 385, y: 37, r: 24 },
      { x: 431, y: 111, r: 37 }, { x: 564, y: 69, r: 27 },
      { x: 563, y: 159, r: 23 }, { x: 293, y: 155, r: 24 }
    ];
    const links = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [2, 5]];
    links.forEach(([from, to], i) => {
      const a = hubs[from], b = hubs[to];
      const bend = (a.x + b.x) / 2;
      stroke(ctx, indigo, active ? .6 : .4, 1.1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y + 8);
      ctx.bezierCurveTo(bend, a.y + 8, bend, b.y + 8, b.x, b.y + 8);
      ctx.stroke();
      const p = (t * .16 + i * .17) % 1;
      const x = bezier(a.x, bend, bend, b.x, p);
      const y = bezier(a.y + 8, a.y + 8, b.y + 8, b.y + 8, p);
      ctx.globalAlpha = .9; ctx.fillStyle = aqua;
      ctx.beginPath(); ctx.moveTo(x, y - 3); ctx.lineTo(x + 4, y);
      ctx.lineTo(x, y + 3); ctx.lineTo(x - 4, y); ctx.closePath(); ctx.fill();
    });
    hubs.forEach((hub, i) => {
      const { x, y, r } = hub;
      const hexagon = (offset = 0) => {
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = Math.PI / 3 * j;
          const px = x + Math.cos(angle) * r, py = y + Math.sin(angle) * r * .6 + offset;
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      };
      stroke(ctx, indigo, .38, 1);
      hexagon(12); ctx.stroke();
      for (const j of [0, 1, 2, 3]) {
        const angle = Math.PI / 3 * j;
        const px = x + Math.cos(angle) * r, py = y + Math.sin(angle) * r * .6;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + 12); ctx.stroke();
      }
      hexagon(); ctx.globalAlpha = 1; ctx.fillStyle = "#093d4a"; ctx.fill();
      stroke(ctx, i === 2 ? aqua : indigo, active ? .95 : .78, 1.4);
      hexagon(); ctx.stroke();
      // A small, raised scientific core on each module.
      const top = y - (i === 2 ? 27 : 17), size = i === 2 ? 12 : 7;
      ctx.beginPath(); ctx.moveTo(x - size, y - 2); ctx.lineTo(x - size, top);
      ctx.lineTo(x, top - size * .45); ctx.lineTo(x + size, top);
      ctx.lineTo(x + size, y - 2); ctx.lineTo(x, y + size * .45);
      ctx.closePath(); ctx.moveTo(x - size, top); ctx.lineTo(x, top + size * .45);
      ctx.lineTo(x + size, top); ctx.moveTo(x, top + size * .45);
      ctx.lineTo(x, y + size * .45); ctx.stroke();
      dot(ctx, x, top - size * .45, 2, aqua, .65 + Math.sin(t * 1.6 - i) * .25);
    });
  }

  // A marine cross-section: offshore platform, mooring and seabed lander.
  function facilities(ctx, t, active) {
    const buoyY = 76 + Math.sin(t * 1.3) * 2.5;
    // Water surface and seabed stay quiet around the moving instruments.
    stroke(ctx, indigo, .35, 1);
    ctx.beginPath();
    for (let x = 217; x <= 612; x += 3) {
      const y = 80 + Math.sin(x / 23 - t * .9) * 2.3;
      if (x === 217) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    stroke(ctx, indigo, .25, 1);
    ctx.beginPath(); ctx.moveTo(224, 177);
    ctx.bezierCurveTo(335, 169, 387, 187, 474, 176);
    ctx.bezierCurveTo(531, 167, 568, 177, 610, 172); ctx.stroke();

    // Four-legged platform with a deck, cabin, railings and an instrument mast.
    stroke(ctx, indigo, active ? .95 : .78, 1.5);
    ctx.beginPath();
    ctx.moveTo(268, 66); ctx.lineTo(260, 174);
    ctx.moveTo(306, 66); ctx.lineTo(315, 174);
    ctx.moveTo(268, 92); ctx.lineTo(311, 132); ctx.lineTo(261, 162);
    ctx.moveTo(308, 92); ctx.lineTo(264, 132); ctx.lineTo(314, 162);
    ctx.moveTo(253, 65); ctx.lineTo(322, 65); ctx.lineTo(322, 58);
    ctx.lineTo(253, 58); ctx.closePath();
    ctx.moveTo(256, 58); ctx.lineTo(256, 47); ctx.lineTo(319, 47); ctx.lineTo(319, 58);
    ctx.moveTo(261, 47); ctx.lineTo(261, 58);
    ctx.moveTo(314, 47); ctx.lineTo(314, 58);
    ctx.moveTo(274, 47); ctx.lineTo(274, 29); ctx.lineTo(300, 29); ctx.lineTo(300, 47);
    ctx.moveTo(287, 29); ctx.lineTo(287, 13);
    ctx.moveTo(282, 18); ctx.lineTo(292, 18); ctx.stroke();
    stroke(ctx, aqua, .85, 1.3);
    ctx.strokeRect(280, 35, 6, 6); ctx.strokeRect(290, 35, 5, 6);
    dot(ctx, 287, 13, 2, aqua, .9);

    // The buoy gently follows the surface; a flexible cable reaches its anchor.
    stroke(ctx, indigo, .6, 1.2);
    ctx.beginPath(); ctx.moveTo(432, buoyY + 6);
    ctx.bezierCurveTo(416 + Math.sin(t) * 4, 117, 448, 141, 432, 176);
    ctx.stroke();
    stroke(ctx, aqua, .85, 1.5);
    ctx.beginPath(); ctx.ellipse(432, buoyY, 13, 4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(422, buoyY + 1); ctx.lineTo(426, buoyY + 7);
    ctx.lineTo(438, buoyY + 7); ctx.lineTo(442, buoyY + 1);
    ctx.moveTo(432, buoyY - 3); ctx.lineTo(432, buoyY - 26);
    ctx.moveTo(432, buoyY - 22); ctx.lineTo(439, buoyY - 18); ctx.lineTo(432, buoyY - 15);
    ctx.stroke();
    stroke(ctx, indigo, .75, 1.4);
    ctx.beginPath(); ctx.moveTo(425, 178); ctx.lineTo(432, 171); ctx.lineTo(439, 178); ctx.stroke();
    for (const depth of [113, 143]) {
      const x = depth === 113 ? 432 : 437;
      ctx.strokeRect(x - 4, depth - 5, 8, 10);
      dot(ctx, x, depth, 1.7, aqua, .8);
    }

    // A seabed lander emits acoustic fans upwards, distinct from surface rings.
    stroke(ctx, indigo, .85, 1.5);
    ctx.beginPath(); ctx.moveTo(532, 174); ctx.lineTo(540, 151);
    ctx.lineTo(560, 151); ctx.lineTo(568, 174);
    ctx.moveTo(528, 174); ctx.lineTo(536, 174);
    ctx.moveTo(564, 174); ctx.lineTo(572, 174);
    ctx.moveTo(540, 159); ctx.lineTo(560, 159); ctx.stroke();
    stroke(ctx, aqua, .85, 1.3); ctx.strokeRect(545, 143, 10, 9);
    for (let i = 0; i < 3; i++) {
      const phase = (t * .24 + i / 3) % 1;
      stroke(ctx, aqua, (1 - phase) * (active ? .65 : .45), 1);
      ctx.beginPath(); ctx.arc(550, 145, 12 + phase * 47, -Math.PI * .76, -Math.PI * .24); ctx.stroke();
    }
  }

  // Data records enter a management plan; each row is checked before release.
  function policy(ctx, t, active) {
    const cycle = t % 10;
    const fade = Math.min(1, (10 - cycle) / .7);
    const clamp = value => Math.max(0, Math.min(1, value));
    const ease = value => value * value * (3 - 2 * value);
    const check = (x, y, progress, size = 1, alpha = 1) => {
      const first = Math.min(1, progress / .35);
      const second = clamp((progress - .35) / .65);
      stroke(ctx, aqua, alpha, 1.8);
      ctx.beginPath(); ctx.moveTo(x - 5 * size, y);
      ctx.lineTo(x + (-5 + 4 * first) * size, y + 4 * first * size);
      if (second > 0) ctx.lineTo(x + (-1 + 9 * second) * size, y + (4 - 12 * second) * size);
      ctx.stroke();
    };

    // A folded document holds three records, distinct from the server branches.
    stroke(ctx, indigo, active ? .95 : .78, 1.5);
    ctx.beginPath(); ctx.moveTo(390, 24); ctx.lineTo(466, 24);
    ctx.lineTo(490, 48); ctx.lineTo(490, 176); ctx.lineTo(390, 176);
    ctx.closePath(); ctx.moveTo(466, 24); ctx.lineTo(466, 48);
    ctx.lineTo(490, 48); ctx.stroke();
    stroke(ctx, indigo, .45, 1.2);
    ctx.beginPath(); ctx.moveTo(406, 40); ctx.lineTo(443, 40); ctx.stroke();

    for (let i = 0; i < 3; i++) {
      const y = 67 + i * 39;
      const progress = clamp((cycle - i * 1.4) / 1.8);
      const accepted = ease(clamp((cycle - i * 1.4 - 1.8) / .55));
      // Small source tables and curved lanes remain legible when motion is off.
      stroke(ctx, indigo, .55, 1.1);
      ctx.strokeRect(245, y - 10, 32, 20);
      ctx.beginPath(); ctx.moveTo(245, y - 3); ctx.lineTo(277, y - 3);
      ctx.moveTo(256, y - 3); ctx.lineTo(256, y + 10);
      ctx.moveTo(267, y - 3); ctx.lineTo(267, y + 10); ctx.stroke();
      stroke(ctx, indigo, .25, 1);
      ctx.beginPath(); ctx.moveTo(285, y);
      ctx.bezierCurveTo(325, y, 340, y - 14, 382, y); ctx.stroke();

      if (progress > 0 && progress < 1) {
        const p = ease(progress);
        const x = bezier(285, 325, 340, 382, p);
        const py = bezier(y, y, y - 14, y, p);
        stroke(ctx, aqua, fade, 1.4);
        ctx.strokeRect(x - 4, py - 3, 8, 6);
        dot(ctx, x - 11, py, 1.5, aqua, .45 * fade);
      }

      // A record fills, then a hand-drawn check confirms it.
      stroke(ctx, indigo, .25, 1.1);
      ctx.beginPath(); ctx.moveTo(405, y - 3); ctx.lineTo(447, y - 3);
      ctx.moveTo(405, y + 4); ctx.lineTo(432, y + 4); ctx.stroke();
      if (accepted > 0) {
        stroke(ctx, aqua, .75 * fade, 1.3);
        ctx.beginPath(); ctx.moveTo(405, y - 3); ctx.lineTo(405 + 42 * accepted, y - 3);
        ctx.moveTo(405, y + 4); ctx.lineTo(405 + 27 * accepted, y + 4); ctx.stroke();
        check(466, y, accepted, .7, fade);
      }
    }

    // The completed plan releases a record to a circular approval seal.
    const release = ease(clamp((cycle - 5.5) / 1.2));
    stroke(ctx, indigo, .3, 1.1);
    ctx.beginPath(); ctx.moveTo(498, 105); ctx.lineTo(538, 105); ctx.stroke();
    ring(ctx, 565, 105, 23, .18);
    if (release > 0 && release < 1) dot(ctx, 498 + 40 * release, 105, 3, aqua, fade);
    const seal = ease(clamp((cycle - 6.7) / .6));
    if (seal > 0) {
      stroke(ctx, aqua, .8 * fade, 1.4);
      ctx.beginPath(); ctx.arc(565, 105, 23, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * seal); ctx.stroke();
      check(564, 107, seal, 1.4, fade);
      ring(ctx, 565, 105, 23 + (1 - Math.exp(-(cycle - 6.7))) * 11, .25 * (1 - seal) * fade);
    }
  }

  // A conversation, rather than a network: question, listening, then a reply.
  function chatbot(ctx, t, active) {
    const cycle = t % 10;
    const ease = value => {
      const p = Math.max(0, Math.min(1, value));
      return p * p * (3 - 2 * p);
    };
    const fade = 1 - ease((cycle - 9) / 1);
    const question = ease(cycle / .8) * fade;
    const answer = ease((cycle - 4.2) / .8) * fade;

    function bubble(x, y, w, h, right, alpha) {
      stroke(ctx, right ? aqua : indigo, alpha, 1.5);
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 11); ctx.stroke();
      ctx.beginPath();
      const tail = right ? x + 13 : x + w - 13;
      ctx.moveTo(tail - 5, y + h); ctx.lineTo(tail, y + h + 8);
      ctx.lineTo(tail + 5, y + h); ctx.stroke();
    }

    bubble(225, 32 - question * 4, 90, 52, false, .2 + question * .65);
    // Three staggered dots suggest a question being typed.
    for (let i = 0; i < 3; i++) {
      const lift = cycle < 2.8 ? Math.max(0, Math.sin(cycle * 5 - i * .8)) * 3 : 0;
      dot(ctx, 253 + i * 17, 54 - question * 4 - lift, 2.8, indigo, .35 + question * .55);
    }

    ctx.save();
    ctx.translate(397, 99 + Math.sin(t * 1.7) * 3);
    // A rounded visor, antenna and two small ear pieces give the bot its own silhouette.
    stroke(ctx, indigo, .85, 1.6);
    ctx.beginPath(); ctx.moveTo(0, -45); ctx.lineTo(0, -59); ctx.stroke();
    dot(ctx, 0, -63, 4, aqua, .7 + Math.sin(t * 3) * .2);
    ctx.beginPath(); ctx.roundRect(-47, -30, 8, 24, 4);
    ctx.roundRect(39, -30, 8, 24, 4); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-39, -45, 78, 65, 20);
    ctx.globalAlpha = 1; ctx.fillStyle = "#093d4a"; ctx.fill();
    stroke(ctx, active ? aqua : indigo, .95, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-28, -32, 56, 30, 12);
    stroke(ctx, aqua, .35, 1); ctx.stroke();
    const blink = Math.pow(Math.max(0, Math.cos((t - 2.5) * Math.PI / 2.8)), 36);
    for (const x of [-12, 12]) {
      ctx.beginPath(); ctx.ellipse(x, -18, 3.3, Math.max(.7, 5 * (1 - blink)), 0, 0, Math.PI * 2);
      ctx.globalAlpha = .95; ctx.fillStyle = aqua; ctx.fill();
    }
    stroke(ctx, aqua, .85, 1.5);
    ctx.beginPath(); ctx.moveTo(-8, 7); ctx.quadraticCurveTo(0, 13 + answer * 3, 8, 7); ctx.stroke();
    // A quiet listening waveform becomes more expressive while composing the answer.
    for (let i = 0; i < 7; i++) {
      const thinking = cycle > 2 && cycle < 4.6;
      const h = 2 + (thinking ? (Math.sin(t * 7 + i * 1.2) + 1) * 6 : Math.sin(i * .8 + t) * 1.5 + 2);
      stroke(ctx, i === 3 ? aqua : indigo, thinking ? .9 : .4, 2.3);
      ctx.beginPath(); ctx.moveTo((i - 3) * 9, 45 - h); ctx.lineTo((i - 3) * 9, 45 + h); ctx.stroke();
    }
    ctx.restore();

    bubble(481, 67 - answer * 5, 109, 72, true, .18 + answer * .7);
    for (let i = 0; i < 3; i++) {
      const progress = ease((cycle - 4.5 - i * .65) / .9) * fade;
      stroke(ctx, aqua, .16 + answer * .7, 1.8);
      ctx.beginPath(); ctx.moveTo(496, 85 + i * 16 - answer * 5);
      ctx.lineTo(496 + [76, 60, 42][i] * (.15 + .85 * progress), 85 + i * 16 - answer * 5); ctx.stroke();
    }
  }

  const draw = { observatory, servers, map, models, infrastructure, facilities, policy, chatbot };

  function paint(scene, time) {
    const { ctx, canvas, width, height } = scene;
    if (!width || !height) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (scene.kind === "dashboard") {
      ctx.scale(canvas.width / width, canvas.height / height);
      dashboard(ctx, time, scene.active, width, height);
      ctx.restore();
      return;
    }
    const horizontalScale = canvas.width / 640;
    if (["infrastructure", "facilities", "policy", "chatbot"].includes(scene.kind)) {
      // Preserve instrument and module proportions, including on small phones.
      const scale = Math.min(horizontalScale, canvas.height / 200);
      ctx.translate((canvas.width - 640 * scale) / 2, (canvas.height - 200 * scale) / 2);
      ctx.scale(scale, scale);
      draw[scene.kind](ctx, time, scene.active);
      ctx.restore();
      return;
    }
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
  document.addEventListener("ismar:dashboard-update", () => {
    scenes.filter(scene => scene.kind === "dashboard").forEach(scene => paint(scene, elapsed));
  });
  sync();
})();
