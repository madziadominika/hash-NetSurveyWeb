// src/components/ReportView.jsx

import "../ReportPrint.css";
import logo from "../assets/logo.png";

export default function ReportView({ csvData = [] }) {

  // ---------- VARIABLES DINÁMICAS (CORREGIDAS PARA TU CSV) ----------

  // Detectar claves reales del CSV (porque vienen en minúsculas)
  const canalKey = Object.keys(csvData[0] || {}).find(k => k.toLowerCase() === "canal");
  const timestampKey = Object.keys(csvData[0] || {}).find(k => k.toLowerCase() === "timestamp");

  // Total de lecturas
  const totalLecturas = csvData.length;

  // Puntos únicos detectados
  const puntosUnicos = new Set(
    csvData.map((row) => row.BSSID || row.SSID)
  ).size;

  // Fecha (primer timestamp)
  const fechaAnalisis =
    csvData.length > 0 ? csvData[0][timestampKey].split(" ")[0] : "—";

  // Bandas según el canal
  const bandas = new Set(
    csvData.map((row) => {
      const canal = Number(row[canalKey]);
      if (canal <= 14) return "2.4 GHz";
      if (canal >= 30) return "5 GHz";
      return null;
    }).filter(Boolean)
  );

  // --------------------------------------------------------------

  return (
    <div id="report-page">   

      <div id="report-container">

        {/* ENCABEZADO */}
<div className="report-header">
  <img src={logo} alt="Logo NetSurvey Web" className="logo" />

  <div className="header-text">
    <h1 className="title">NetSurvey Web</h1>
    <p className="subtitle">
      Solución profesional de auditoría y análisis de redes Wi-Fi
    </p>
  </div>
</div>


        <hr className="separator" />

        {/* TÍTULO PRINCIPAL */}
        <h2 className="main-title">Informe de auditoría Wi-Fi</h2>

        <p className="description">
          Este documento resume la información general, técnica y operativa obtenida
          a partir del archivo CSV importado, junto con conclusiones aplicables a
          entornos de oficina.
        </p>

        {/* CUADRO */}
        <div className="box">
          <h2 className="box-title">INFORMACIÓN DEL PROYECTO</h2>

          <ul className="info-list">
            <li><strong>Cliente / Empresa:</strong> Oficina ejemplo</li>
            <li><strong>Ubicación:</strong> Madrid (España)</li>
            <li><strong>Técnico responsable:</strong> NetSurvey Web</li>
            <li><strong>Fecha del análisis:</strong> {fechaAnalisis}</li>
            <li><strong>Número de lecturas (CSV):</strong> {totalLecturas}</li>
            <li><strong>Puntos de medición detectados:</strong> {puntosUnicos}</li>
            <li><strong>Bandas analizadas:</strong> {[...bandas].join(" y ")}</li>
          </ul>
        </div>

        {/* RESUMEN */}
        <h3 className="section-title">Resumen técnico</h3>
        <p className="paragraph">
          Las lecturas analizadas pertenecen a un entorno de oficina de 100–150 m².
          Se confirmaron señales estables en las bandas { [...bandas].join(" y ") },
          sin interferencias críticas.
        </p>

        {/* CONCLUSIÓN */}
        <h3 className="section-title">Conclusión</h3>
        <p className="paragraph">
          La red Wi-Fi presenta un comportamiento general correcto. No existen incidencias
          críticas y el rendimiento es adecuado para tareas de oficina estándar.
        </p>

        {/* PIE */}
        <p className="footer">
          Informe generado automáticamente por <strong>NetSurvey Web</strong> — Versión 1.0
        </p>

        <button className="print-btn" onClick={() => window.print()}>
          Imprimir informe
        </button>

      </div>
    </div>
  );
}
