/* ==========================================================
   KONFIGURACE MAPY
   Zde měníte texty, cesty k datům, styly a obsah legendy.
   Logika mapy je v map.js, ovládací prvky v controls.js.
   ========================================================== */

const CONFIG = {

  /* ---------- Texty ---------- */
  title: "Název mapy",
  subtitle: "Ukázková webová mapa – placeholder data",

  colophon: {
    author: "Jméno Příjmení",
    year: 2026,
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.cs",
    dataNote: "Data: placeholder (nahraďte vlastními)"
  },

  /* ---------- Výchozí pohled (okolí Olomouce) ---------- */
  view: { center: [49.5938, 17.2509], zoom: 12, minZoom: 5, maxZoom: 19 },

  /* ---------- Podkladové mapy ---------- */
  basemaps: [
    {
      name: "OpenStreetMap",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> přispěvatelé'
      },
      default: true
    },
    {
      name: "Letecký snímek (Esri)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri – Source: Esri, Maxar, Earthstar Geographics, GIS User Community"
      }
    }
  ],

  /* ---------- Vektorové vrstvy (GeoJSON) ----------
     popupTitle  = vlastnost použitá jako nadpis popupu
     popupFields = vlastnosti zobrazené v tabulce {klíč: popisek}
  ----------------------------------------------------- */
  vectorLayers: {
    points: {
      label: "Body",
      url: "data/points.geojson",
      color: "#d6336c",
      style: { radius: 8, weight: 2, color: "#ffffff", fillColor: "#d6336c", fillOpacity: 1 },
      popupTitle: "nazev",
      popupFields: { typ: "Typ", popis: "Popis", rok: "Rok" }
    },
    lines: {
      label: "Linie",
      url: "data/lines.geojson",
      color: "#1c7ed6",
      style: { color: "#1c7ed6", weight: 4, opacity: 0.9 },
      hoverStyle: { weight: 7 },
      popupTitle: "nazev",
      popupFields: { typ: "Typ", delka_km: "Délka (km)", popis: "Popis" }
    },
    polygons: {
      label: "Polygony",
      url: "data/polygons.geojson",
      color: "#2f9e44",
      style: { color: "#2f9e44", weight: 2, fillColor: "#2f9e44", fillOpacity: 0.3 },
      hoverStyle: { fillOpacity: 0.55 },
      popupTitle: "nazev",
      popupFields: { typ: "Typ", plocha_ha: "Plocha (ha)", popis: "Popis" }
    }
  },

  /* ---------- Rastrová vrstva ----------
     Rastr je obrázek (PNG/JPG) umístěný pomocí hranic v WGS84:
     [[jih, západ], [sever, východ]].
     Pro velké rastry doporučuji vygenerovat dlaždice (gdal2tiles)
     a použít L.tileLayer – viz README.
  ----------------------------------------------------- */
  raster: {
    label: "Rastr",
    url: "data/raster.png",
    bounds: [[49.560, 17.180], [49.630, 17.330]],
    opacity: 0.7,
    legend: {
      title: "Hodnota rastru",
      minLabel: "nízká",
      maxLabel: "vysoká",
      gradient: "linear-gradient(to right, #440154, #3b528b, #21908d, #5dc863, #fde725)"
    }
  },

  /* ---------- Počáteční viditelnost vrstev ---------- */
  visibleOnLoad: { raster: true, polygons: true, lines: true, points: true }
};
