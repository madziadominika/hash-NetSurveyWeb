// src/components/ReportView.jsx

import "../ReportPrint.css";
import logo from "../assets/logo.png";

export default function ReportView() {
  return (
    <div id="report-page">   {/* ← ESTE CONTENEDOR FALTABA */}

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
            <li><strong>Fecha del análisis:</strong> 2025-11-24</li>
            <li><strong>Número de lecturas (CSV):</strong> XX</li>
            <li><strong>Puntos de medición detectados:</strong> XX</li>
            <li><strong>Bandas analizadas:</strong> 2.4 GHz y 5 GHz</li>
          </ul>
        </div>

        {/* RESUMEN */}
        <h3 className="section-title">Resumen técnico</h3>
        <p className="paragraph">
          Las lecturas analizadas pertenecen a un entorno de oficina de 100–150 m².
          Se confirmaron señales estables en 2.4 GHz y 5 GHz, sin interferencias críticas.
          El entorno es adecuado para el uso habitual y no se detectaron anomalías relevantes.
        </p>

        {/* CONCLUSIÓN */}
        <h3 className="section-title">Conclusión</h3>
        <p className="paragraph">
          La red Wi-Fi presenta un comportamiento general correcto. No existen incidencias
          críticas y el rendimiento es adecuado para tareas de oficina estándar.
          El sistema puede ampliarse o ajustarse si se incrementa el número de usuarios
          o se requieren mayores niveles de cobertura.
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
