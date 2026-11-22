/* ==========================================================
   OVLÁDACÍ PRVKY: popupy, legenda, tiráž
   ========================================================== */

/* ---------- Popup z vlastností prvku ---------- */
function buildPopup(props, layerCfg) {
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const title = props[layerCfg.popupTitle] ?? layerCfg.label;
  const rows = Object.entries(layerCfg.popupFields)
    .filter(([key]) => props[key] !== undefined && props[key] !== null && props[key] !== "")
    .map(([key, label]) => `<tr><th>${esc(label)}</th><td>${esc(props[key])}</td></tr>`)
    .join("");

  return `<h3 class="popup-title">${esc(title)}</h3>` +
         (rows ? `<table class="popup-table">${rows}</table>` : "");
}

/* ---------- Legenda ----------
   Položka se skryje, když uživatel vypne příslušnou vrstvu.
   Metoda control.setVisible(key, bool) to řídí.
*/
function createLegend(cfg, onRasterOpacity) {
  const control = L.control({ position: "bottomright" });

  control.onAdd = function () {
    const div = L.DomUtil.create("div", "panel legend");
    const v = cfg.vectorLayers;
    const r = cfg.raster;

    div.innerHTML = `
      <h2>Legenda</h2>
      <div class="legend-item" data-key="points">
        <span class="legend-sym"><span class="sym-point" style="background:${v.points.color}"></span></span>
        <span>${v.points.label}</span>
      </div>
      <div class="legend-item" data-key="lines">
        <span class="legend-sym"><span class="sym-line" style="border-top-color:${v.lines.color}"></span></span>
        <span>${v.lines.label}</span>
      </div>
      <div class="legend-item" data-key="polygons">
        <span class="legend-sym"><span class="sym-polygon"
          style="border-color:${v.polygons.color}; background:${v.polygons.color}4d"></span></span>
        <span>${v.polygons.label}</span>
      </div>
      <div class="legend-raster legend-item" data-key="raster" style="display:block">
        <div>${r.legend.title}</div>
        <div class="legend-ramp" style="background:${r.legend.gradient}"></div>
        <div class="legend-ramp-labels"><span>${r.legend.minLabel}</span><span>${r.legend.maxLabel}</span></div>
        <label class="legend-opacity">Průhlednost
          <input type="range" min="0" max="1" step="0.05" value="${r.opacity}" aria-label="Neprůhlednost rastru">
        </label>
      </div>`;

    // Legenda nesmí „ukrást“ tažení a zoom mapy
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    div.querySelector("input[type=range]").addEventListener("input", (e) => {
      onRasterOpacity(parseFloat(e.target.value));
    });

    control._div = div;
    return div;
  };

  control.setVisible = function (key, visible) {
    const el = control._div && control._div.querySelector(`[data-key="${key}"]`);
    if (el) el.style.display = visible ? (key === "raster" ? "block" : "flex") : "none";
  };

  return control;
}

/* ---------- Tiráž (autor + licence) ---------- */
function createColophon(cfg) {
  const c = cfg.colophon;
  const control = L.control({ position: "bottomleft" });

  control.onAdd = function () {
    const div = L.DomUtil.create("div", "panel colophon");
    div.innerHTML = `
      <div><strong>Autor:</strong> ${c.author}, ${c.year}</div>
      <div><strong>Licence:</strong> <a href="${c.licenseUrl}" target="_blank" rel="noopener">${c.licenseName}</a></div>
      <div>${c.dataNote}</div>`;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  return control;
}
