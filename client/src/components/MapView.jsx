// src/components/MapView.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ csvData = [], plano }) {
  useEffect(() => {
    if (!plano) return;

    // Reiniciar mapa si ya existe
    if (L.DomUtil.get("map") !== null) {
      L.DomUtil.get("map")._leaflet_id = null;
    }

    const width = 3650;
    const height = 2650;

    const bounds = [
      [0, 0],
      [height, width],
    ];

    const map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      inertia: false,
    });

    L.imageOverlay(plano, bounds).addTo(map);
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);

    // Si no hay CSV, no se muestran puntos
    if (!csvData || csvData.length === 0) {
      return;
    }

    function getStatsFor(locationName) {
      const rows = csvData.filter(
        (r) =>
          (r.ubicacion || r.Ubicacion || "").toLowerCase() ===
          locationName.toLowerCase()
      );

      if (!rows.length) return null;

      const canales = [...new Set(rows.map((r) => r.canal || r.Canal))];
      const rssis = rows
        .map((r) => Number(r.rssi || r.RSSI))
        .filter((n) => !isNaN(n));

      const avgRSSI =
        rssis.length > 0
          ? Math.round(rssis.reduce((a, b) => a + b, 0) / rssis.length)
          : "—";

      return {
        mediciones: rows.length,
        canales,
        avgRSSI,
        ssid: rows[0].ssid || rows[0].SSID || "—",
        bssid: rows[0].bssid || rows[0].BSSID || "—",
      };
    }

    // Puntos fijos del plano
    const puntos = [
      { nombre: "Sala de Reuniones", color: "green", x: 900, y: 1800 },
      { nombre: "Recepción", color: "green", x: 1500, y: 2000 },
      { nombre: "Open Space Arriba", color: "green", x: 1500, y: 1500 },
      { nombre: "Open Space Centro", color: "green", x: 1500, y: 1000 },
      { nombre: "Open Space Abajo", color: "green", x: 1500, y: 500 },
      { nombre: "Cocina", color: "orange", x: 3100, y: 2000 },
      { nombre: "Aseos 1", color: "red", x: 1000, y: 600 },
      { nombre: "Aseos 2", color: "red", x: 1000, y: 250 },
      { nombre: "AP1", color: "pink", x: 1212, y: 1612 },
      { nombre: "AP2", color: "pink", x: 3100, y: 124 },
    ];

    puntos.forEach((p) => {
      const icon = L.divIcon({
        className: "ns-marker-icon",
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background: ${p.color};
            border: 3px solid white;
            border-radius: 50%;
          "></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([p.y, p.x], { icon }).addTo(map);

      const info = getStatsFor(p.nombre);

      marker.bindPopup(
        info
          ? `
            <strong>${p.nombre}</strong><br/>
            SSID: ${info.ssid}<br/>
            BSSID: ${info.bssid}<br/>
            Canal/es: ${info.canales.join(", ")}<br/>
            Mediciones: ${info.mediciones}<br/>
            RSSI promedio: ${info.avgRSSI} dBm`
          : `<strong>${p.nombre}</strong><br/>Sin datos para este punto.`
      );
    });
  }, [csvData, plano]);

  return (
    <div style={{ width: "100%", textAlign: "center", marginTop: "40px" }}>
      <h2 style={{ fontSize: "40px" }}>Mapa de Medidas</h2>

      {!plano ? (
        <p style={{ opacity: 0.6 }}>No hay plano cargado.</p>
      ) : (
        <div
          id="map"
          style={{
            height: "650px",
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            borderRadius: "15px",
            border: "2px solid #555",
            marginTop: "20px",
          }}
        />
      )}
    </div>
  );
}
