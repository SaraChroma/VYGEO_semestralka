/* ==========================================================
   HLAVNÍ SKRIPT MAPY
   Načte konfiguraci, vytvoří mapu, vrstvy a ovládací prvky.
   ========================================================== */

/* ---------- Název ---------- */
document.title = CONFIG.title;
document.querySelector("#map-title h1").textContent = CONFIG.title;
document.querySelector("#map-title p").textContent = CONFIG.subtitle;

/* ---------- Mapa ---------- */
const map = L.map("map", {
  center: CONFIG.view.center,
  zoom: CONFIG.view.zoom,
  minZoom: CONFIG.view.minZoom,
  maxZoom: CONFIG.view.maxZoom
});

/* ---------- Podkladové mapy ---------- */
const baseLayers = {};
CONFIG.basemaps.forEach((b) => {
  const layer = L.tileLayer(b.url, b.options);
  baseLayers[b.name] = layer;
  if (b.default) layer.addTo(map);
});

/* ---------- GeoJSON vrstvy ---------- */
// Vytvoří prázdnou vrstvu; data se do ní doplní po načtení souboru.
function createGeoJsonLayer(cfg, isPoint) {
  return L.geoJSON(null, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, cfg.style),
    style: isPoint ? undefined : () => cfg.style,
    onEachFeature: (feature, layer) => {
      layer.bindPopup(buildPopup(feature.properties || {}, cfg));

      // zvýraznění při najetí myší (linie a polygony)
      if (cfg.hoverStyle) {
        layer.on("mouseover", () => layer.setStyle(cfg.hoverStyle));
        layer.on("mouseout",  () => layer.setStyle(cfg.style));
      }
    }
  });
}

function loadGeoJson(layer, url) {
  return fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => layer.addData(data))
    .catch((err) => {
      console.error("Nepodařilo se načíst data:", err);
      alert("Nepodařilo se načíst " + url +
            "\nMapu je nutné spustit přes lokální server (např. python -m http.server), ne otevřením souboru.");
    });
}

const V = CONFIG.vectorLayers;
const pointsLayer   = createGeoJsonLayer(V.points, true);
const linesLayer    = createGeoJsonLayer(V.lines, false);
const polygonsLayer = createGeoJsonLayer(V.polygons, false);

loadGeoJson(pointsLayer,   V.points.url);
loadGeoJson(linesLayer,    V.lines.url);
loadGeoJson(polygonsLayer, V.polygons.url);

/* ---------- Rastr ---------- */
const rasterLayer = L.imageOverlay(CONFIG.raster.url, CONFIG.raster.bounds, {
  opacity: CONFIG.raster.opacity,
  interactive: false
});

/* ---------- Přepínač vrstev ---------- */
const overlays = {
  [V.points.label]:      pointsLayer,
  [V.lines.label]:       linesLayer,
  [V.polygons.label]:    polygonsLayer,
  [CONFIG.raster.label]: rasterLayer
};
L.control.layers(baseLayers, overlays, { collapsed: false, position: "topright" }).addTo(map);

/* ---------- Počáteční viditelnost ---------- */
const layerByKey = { points: pointsLayer, lines: linesLayer, polygons: polygonsLayer, raster: rasterLayer };

// Přidáváme od spodu nahoru, aby vektory ležely nad rastrem
["raster", "polygons", "lines", "points"].forEach((key) => {
  if (CONFIG.visibleOnLoad[key]) layerByKey[key].addTo(map);
});

/* ---------- Měřítko ---------- */
L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map);

/* ---------- Tiráž ---------- */
createColophon(CONFIG).addTo(map);

/* ---------- Legenda (reaguje na zapínání/vypínání vrstev) ---------- */
const legend = createLegend(CONFIG, (opacity) => rasterLayer.setOpacity(opacity));
legend.addTo(map);

Object.entries(layerByKey).forEach(([key, layer]) => {
  legend.setVisible(key, map.hasLayer(layer));
  layer.on("add",    () => legend.setVisible(key, true));
  layer.on("remove", () => legend.setVisible(key, false));
});
