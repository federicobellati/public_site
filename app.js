(() => {
  "use strict";
  const config = window.ISMAR_PORTAL || {};
  const container = document.getElementById("tiles");
  const safeIcons = /^[a-z0-9-]+$/;
  const kinds = new Set(["observatory", "servers", "map", "models", "infrastructure", "facilities"]);

  function safeHref(value) {
    if (typeof value !== "string" || !value.trim()) return "./";
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "file:", "mailto:"].includes(url.protocol) ? value : "./";
    } catch { return "./"; }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(name, className) {
    const img = element("img", className);
    img.src = `assets/icons/${safeIcons.test(name) ? name : "stack-2"}.svg`;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.width = img.height = 56;
    return img;
  }

  for (const [index, item] of (config.tiles || []).entries()) {
    if (item.placeholder) {
      const placeholder = element("div", "tile tile-placeholder");
      placeholder.setAttribute("aria-hidden", "true");
      container.append(placeholder);
      continue;
    }
    const kind = kinds.has(item.animation) ? item.animation : "servers";
    const tile = element("a", "tile");
    tile.href = safeHref(item.href);
    tile.dataset.kind = kind;
    if (item.newTab) {
      tile.target = "_blank";
      tile.rel = "noopener noreferrer";
    }

    const title = element("h2", "", item.title);
    title.id = `tile-title-${index}`;
    tile.setAttribute("aria-labelledby", title.id);
    if (item.newTab) {
      const hint = element("span", "visually-hidden", " (si apre in una nuova scheda)");
      title.append(hint);
    }
    const copy = element("div", "tile-copy");
    copy.append(title);
    if (item.description) copy.append(element("p", "tile-description", item.description));
    if (item.detail) copy.append(element("p", "tile-detail", item.detail));
    const canvas = element("canvas", "tile-visual");
    canvas.setAttribute("aria-hidden", "true");
    tile.append(icon(item.icon || "stack-2", "tile-icon"), canvas, icon("arrow-right", "tile-arrow"), copy);
    container.append(tile);
  }

  const footer = document.getElementById("contact-link");
  if (config.footer) {
    footer.textContent = config.footer.label || "ISMAR";
    footer.href = safeHref(config.footer.href);
  }
})();
