import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ csvData = [] }) {
  useEffect(() => {
    // Evita error de inicialización duplicada
    if (L.DomUtil.get("map") !== null) {
      L.DomUtil.get("map")._leaflet_id = null;
    }

    // ---- CONFIGURACIÓN DEL MAPA SOBRE IMAGEN ----

    // Dimensiones aproximadas del plano en píxeles
    const width = 2500;
    const height = 1500;

    // Límites internos (coordenadas del plano)
    const bounds = [
      [0, 0],         // esquina superior izquierda
      [height, width] // esquina inferior derecha
    ];

    // Crear mapa usando CRS.Simple para imágenes
    const map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      zoomControl: true,
    });

    // Cargar la imagen como mapa
    L.imageOverlay("/plano.png", bounds).addTo(map);

    // Ajustar vista
    map.fitBounds(bounds);

    // ---- DIBUJAR MARCADORES DEL CSV ----
    if (csvData.length > 0) {
      csvData.forEach((row, index) => {
        // Posiciones inventadas dentro del mapa
        const x = 400 + index * 120;          // izquierda → derecha
        const y = 700 + (index % 5) * 130;    // arriba → abajo

        const color = Number(row.Canal) <= 14 ? "green" : "blue";

        L.circleMarker([y, x], {
          radius: 12,
          color,
          fillColor: color,
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindPopup(`
            <strong>${row.SSID}</strong><br/>
            <strong>RSSI:</strong> ${row.RSSI}<br/>
            <strong>Canal:</strong> ${row.Canal}<br/>
            <strong>BSSID:</strong> ${row.BSSID}<br/>
            <strong>Hora:</strong> ${row.Timestamp}
        `);
      });
    }
  }, [csvData]);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>Mapa de Medidas (Plano)</h2>

      <div
        id="map"
        style={{
          height: "650px",
          width: "100%",
          borderRadius: "15px",
          border: "2px solid #555",
          marginTop: "20px",
        }}
      ></div>
    </div>
  );
}

