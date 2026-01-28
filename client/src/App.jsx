// src/App.jsx
import { useState, useEffect, useRef } from "react";

import ReportView from "./components/ReportView";
import UploadCSV from "./components/UploadCSV";
import MapView from "./components/MapView";
import Incidencias from "./pages/Incidencias";

export default function App() {
  const [csvData, setCsvData] = useState([]);
  const [csvFilename, setCsvFilename] = useState(null);

  const planoInputRef = useRef(null);

  const [projectInfo, setProjectInfo] = useState({
    cliente: "Oficina NetSurvey",
    ubicacion: "",
    proyecto: "",
    fecha: "",
    clienteId: null,
    ubicacionId: null,
    proyectoId: null,
  });

  const [plano, setPlano] = useState(null);
  const [planoNombre, setPlanoNombre] = useState("");

  // Cargar plano desde localStorage
  useEffect(() => {
    const savedPlano = localStorage.getItem("planoCustom");
    const savedNombre = localStorage.getItem("planoNombre");

    if (savedPlano) setPlano(savedPlano);
    if (savedNombre) setPlanoNombre(savedNombre);
  }, []);

  function handlePlanoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img64 = ev.target.result;
      setPlano(img64);
      localStorage.setItem("planoCustom", img64);

      setPlanoNombre(file.name);
      localStorage.setItem("planoNombre", file.name);
    };
    reader.readAsDataURL(file);
  }

  // Autorrellenar datos cuando se carga un plano
  useEffect(() => {
    if (!plano) return;

    setProjectInfo((prev) => ({
      cliente: prev.cliente || "Oficina NetSurvey",
      ubicacion: prev.ubicacion || "Madrid",
      proyecto: prev.proyecto || "Proyecto Wi-Fi",
      fecha: new Date().toISOString().slice(0, 10),
      clienteId: prev.clienteId,
      ubicacionId: prev.ubicacionId,
      proyectoId: prev.proyectoId,
    }));
  }, [plano]);

  // Cargar datos del proyecto desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("projectInfo");
    if (!saved) return;

    try {
      setProjectInfo((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  function handleProjectChange(e) {
    const { name, value } = e.target;
    setProjectInfo((prev) => ({ ...prev, [name]: value }));
  }

  const currentProjectId = projectInfo.proyectoId || 1;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        color: "white",
        textAlign: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <h1 style={{ fontSize: "86px" }}>NetSurvey Web</h1>

        <h2 style={{ fontSize: "40px" }}>Datos del proyecto</h2>

        {/* Datos del proyecto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Fila 1 */}
          <div style={{ display: "flex", gap: "60px" }}>
            <label style={{ fontSize: "22px" }}>
              Cliente / Empresa
              <input
                type="text"
                name="cliente"
                value={projectInfo.cliente}
                onChange={handleProjectChange}
                style={{
                  padding: "8px",
                  width: "250px",
                  marginLeft: "10px",
                  fontSize: "16px",
                }}
              />
            </label>

            <label style={{ fontSize: "22px" }}>
              Ubicación
              <input
                type="text"
                name="ubicacion"
                value={projectInfo.ubicacion}
                onChange={handleProjectChange}
                style={{
                  padding: "8px",
                  width: "250px",
                  marginLeft: "10px",
                  fontSize: "16px",
                }}
              />
            </label>
          </div>

          {/* Fila 2 */}
          <div style={{ display: "flex", gap: "60px" }}>
            <label style={{ fontSize: "22px" }}>
              Proyecto
              <input
                type="text"
                name="proyecto"
                value={projectInfo.proyecto}
                onChange={handleProjectChange}
                style={{
                  padding: "8px",
                  width: "250px",
                  marginLeft: "10px",
                  fontSize: "16px",
                }}
              />
            </label>

            <label style={{ fontSize: "22px" }}>
              Fecha
              <input
                type="date"
                name="fecha"
                value={projectInfo.fecha}
                onChange={handleProjectChange}
                style={{
                  padding: "8px",
                  width: "220px",
                  marginLeft: "10px",
                  fontSize: "16px",
                }}
              />
            </label>
          </div>
        </div>

        {/* Plano */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "40px" }}>Plano de oficina</h2>

          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #000",
              display: "inline-block",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handlePlanoUpload}
              ref={planoInputRef}
              style={{ padding: "10px", width: "400px" }}
            />
          </div>

          {planoNombre && (
            <p style={{ fontSize: "18px", marginTop: "10px" }}>
              Plano cargado: <strong>{planoNombre}</strong>
            </p>
          )}
        </div>

        {/* Mapa */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "30px auto 0 auto",
          }}
        >
          <MapView csvData={csvData} plano={plano} csvFilename={csvFilename} />
        </div>

        {/* CSV */}
        <UploadCSV setCsvData={setCsvData} setCsvFilename={setCsvFilename} />
      </div>

      {/* Incidencias */}
      <div style={{ width: "100%", maxWidth: "1200px", marginTop: "40px" }}>
        <Incidencias projectId={currentProjectId} />
      </div>

      {/* Informe */}
      <div style={{ width: "100%", maxWidth: "1200px", marginTop: "40px" }}>
        <ReportView
          csvData={csvData}
          projectInfo={projectInfo}
          hasPlano={!!plano}
        />
      </div>
    </div>
  );
}
