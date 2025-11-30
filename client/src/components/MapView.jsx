import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ csvData = [] }) {
  useEffect(() => {
    // Reiniciar mapa si ya existe
    if (L.DomUtil.get("map") !== null) {
      L.DomUtil.get("map")._leaflet_id = null;
    }

    // Tamaño real del plano
    const width = 3500;
    const height = 2500;

    const bounds = [
      [0, 0],
      [height, width],
    ];

    // Crear mapa
    const map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      zoomControl: true,
    });

    // Imagen del plano
    L.imageOverlay("/plano.png", bounds).addTo(map);
    map.fitBounds(bounds);

    // ======================================================
    // DATOS TÉCNICOS SEGÚN COLOR
    // ======================================================

    const getPopupInfo = (color) => {
      switch (color) {
        case "green":
          return {
            cobertura: "Excelente",
            rssi: "-48 dBm",
            canal: "1 / 36",
            interferencia: "Baja",
          };

        case "yellow":
          return {
            cobertura: "Buena",
            rssi: "-60 dBm",
            canal: "1 / 36",
            interferencia: "Media-baja",
          };

        case "orange":
          return {
            cobertura: "Regular",
            rssi: "-72 dBm",
            canal: "6 / 40",
            interferencia: "Media",
          };

        case "red":
          return {
            cobertura: "Mala",
            rssi: "-85 dBm",
            canal: "11 / 44",
            interferencia: "Alta",
          };

        default:
          return {
            cobertura: "-",
            rssi: "-",
            canal: "-",
            interferencia: "-",
          };
      }
    };

    // ======================================================
    //  PUNTOS FIJOS POR HABITACIÓN
    // ======================================================

    const puntosFijos = [
      { nombre: "Comunicación / CPD", color: "yellow", x: 1000, y: 2100 },
      { nombre: "Sala de Reuniones", color: "yellow", x: 900, y: 1800 },
      { nombre: "Recepción", color: "green", x: 1500, y: 2000 },
      { nombre: "Open Space (Arriba)", color: "green", x: 1500, y: 1500 },
      { nombre: "Open Space (centro)", color: "green", x: 1500, y: 1000 },
      { nombre: "Open Space (abajo)", color: "green", x: 1500, y: 500 },
      { nombre: "Cocina", color: "orange", x: 3100, y: 2000 },
      { nombre: "Aseos 1", color: "red", x: 1000, y: 600 },
      { nombre: "Aseos 2", color: "red", x: 1000, y: 250 },
    ];

    // ======================================================
    //  DIBUJAR PUNTOS FIJOS (CON FADE-IN + autoPan OFF)
    // ======================================================

    puntosFijos.forEach((p) => {
      const info = getPopupInfo(p.color);

      const markerIcon = L.divIcon({
        className: "custom-marker marker-fade",   // ⭐ ADD FADE-IN HERE
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background: ${p.color};
            border: 3px solid white;
            border-radius: 50%;
          "></div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      L.marker([p.y, p.x], {
        icon: markerIcon,
        autoPan: false,
      })
        .addTo(map)
        .bindPopup(
          `
          <strong>${p.nombre}</strong><br/>
          Cobertura estimada: ${info.cobertura}<br/>
          RSSI estimado: ${info.rssi}<br/>
          Canal recomendado: ${info.canal}<br/>
          Interferencia: ${info.interferencia}
        `,
          {
            autoPan: false,
          }
        );
    });

    // ======================================================
    //   LEYENDA
    // ======================================================

    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.style.background = "#111";
      div.style.padding = "10px 15px";
      div.style.borderRadius = "8px";
      div.style.color = "white";
      div.innerHTML = `
        <strong>Leyenda</strong><br/>
        <span style="color:green">●</span> Excelente<br/>
        <span style="color:yellow">●</span> Buena<br/>
        <span style="color:orange">●</span> Regular<br/>
        <span style="color:red">●</span> Mala<br/>
      `;
      return div;
    };

    legend.addTo(map);
  }, [csvData]);

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontSize: "32px",
        }}
      >
        Mapa de Medidas (Plano)
      </h2>

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





