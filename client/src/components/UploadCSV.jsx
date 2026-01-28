// src/components/UploadCSV.jsx
import { useState } from "react";

export default function UploadCSV({ setCsvData, setCsvFilename }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);

  const [filterSsid, setFilterSsid] = useState("");
  const [filterCanal, setFilterCanal] = useState("");
  const [filterRssi, setFilterRssi] = useState("all");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Seleccione un archivo CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("http://localhost:4000/api/upload-csv", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    setCsvData(result.data);
    localStorage.setItem("csvData", JSON.stringify(result.data));

    setCsvFilename(selectedFile.name);
    setCsvPreview(result.data);

    // INCIDENCIAS AUTOMÁTICAS
    function createAutoIncidencias() {
      const incidencias = [];

      result.data.forEach((row) => {
        const ubic = String(row.Ubicacion || row.ubicacion || "").toLowerCase();
        const rssi = Number(row.RSSI);

        if (ubic.includes("cocina")) {
          incidencias.push({
            id: Date.now() + Math.random(),
            tipo: rssi <= -75 ? "Media" : "Leve",
            descripcion: "Señal débil en la cocina.",
            foto: "",
            ubicacion: "Cocina",
          });
        }

        if (ubic.includes("aseo")) {
          incidencias.push({
            id: Date.now() + Math.random(),
            tipo: "Crítica",
            descripcion: "Cobertura crítica en aseos.",
            foto: "",
            ubicacion: row.Ubicacion,
          });
        }

        if (ubic.includes("recepción") && rssi <= -70) {
          incidencias.push({
            id: Date.now() + Math.random(),
            tipo: "Media",
            descripcion: "Señal moderada en recepción.",
            foto: "",
            ubicacion: "Recepción",
          });
        }

        if (ubic.includes("sala") && rssi <= -70) {
          incidencias.push({
            id: Date.now() + Math.random(),
            tipo: "Media",
            descripcion: "Señal limitada en la sala de reuniones.",
            foto: "",
            ubicacion: row.Ubicacion,
          });
        }

        if (ubic.includes("open") && rssi <= -75) {
          incidencias.push({
            id: Date.now() + Math.random(),
            tipo: "Leve",
            descripcion: "Señal baja en algunos puestos del open space.",
            foto: "",
            ubicacion: row.Ubicacion,
          });
        }

        if (ubic.includes("cam") && rssi <= -75) {
          incidencias.push({
            id: Date.now() + Math.random(),
            tipo: "Media",
            descripcion: "Señal débil en zona CAM.",
            foto: "",
            ubicacion: "CAM",
          });
        }
      });

      const storageKey = "incidencias_Proyecto Wi-Fi";
      localStorage.setItem(storageKey, JSON.stringify(incidencias));
    }

    createAutoIncidencias();

    alert("Archivo importado correctamente");
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCsvData([]);
    setCsvFilename(null);
    setCsvPreview([]);

    setFilterSsid("");
    setFilterCanal("");
    setFilterRssi("all");

    const input = document.getElementById("csv-input");
    if (input) input.value = "";

    alert("Importación reiniciada");
  };

  // Claves dinámicas
  const firstRow = csvPreview[0] || {};
  const ssidKey = Object.keys(firstRow).find((k) => k.toLowerCase() === "ssid");
  const canalKey = Object.keys(firstRow).find((k) => k.toLowerCase() === "canal");
  const rssiKey = Object.keys(firstRow).find((k) => k.toLowerCase() === "rssi");

  const canalValues = canalKey
    ? Array.from(new Set(csvPreview.map((row) => row[canalKey]))).filter(Boolean)
    : [];

  // FILTRO
  const filteredPreview = csvPreview.filter((row) => {
    let ok = true;

    if (filterSsid && ssidKey) {
      const value = String(row[ssidKey] || "").toLowerCase();
      ok = ok && value.includes(filterSsid.toLowerCase());
    }

    if (filterCanal && canalKey) {
      ok = ok && String(row[canalKey]) === filterCanal;
    }

    if (filterRssi !== "all" && rssiKey) {
      const rssi = Number(row[rssiKey]);

      if (filterRssi === "good") ok = ok && rssi > -75;
      if (filterRssi === "warn") ok = ok && rssi <= -75 && rssi >= -85;
      if (filterRssi === "bad") ok = ok && rssi < -85;
    }

    return ok;
  });

  const getRowStyle = (row) => {
    const base = {
      padding: "8px",
      borderBottom: "1px solid #333",
      color: "white",
    };

    const ubic = String(row.ubicacion || row.Ubicacion || "").toLowerCase();

    if (ubic.includes("aseo")) return { ...base, backgroundColor: "#3b0000" };
    if (ubic.includes("cocina")) return { ...base, backgroundColor: "#7a4f00" };

    return { ...base, backgroundColor: "#003b00" };
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <p
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "25px",
          marginTop: "100px",
          color: "white",
        }}
      >
        Suba un archivo CSV para analizar la red Wi-Fi
      </p>

      <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>Subida de CSV</h2>

      <input
        id="csv-input"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{
          padding: "8px",
          borderRadius: "6px",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      />

      {selectedFile && (
        <p style={{ marginTop: "15px", fontSize: "16px", color: "#ccc" }}>
          Archivo seleccionado: <strong>{selectedFile.name}</strong>
        </p>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button
          onClick={handleUpload}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            backgroundColor: "#4caf50",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "16px",
          }}
        >
          Importar CSV
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            backgroundColor: "#b30000",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "16px",
          }}
        >
          Reset
        </button>
      </div>

      {/* Vista previa */}
      {csvPreview.length > 0 && (
        <div
          style={{
            marginTop: "40px",
            background: "#111",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #444",
            maxWidth: "95%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Datos Importados</h2>

          {/* Filtros */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px",
              color: "white",
            }}
          >
            <div>
              <div>Filtrar por SSID</div>
              <input
                type="text"
                value={filterSsid}
                onChange={(e) => setFilterSsid(e.target.value)}
                style={{ padding: "6px", width: "180px" }}
              />
            </div>

            <div>
              <div>Filtrar por canal</div>
              <select
                value={filterCanal}
                onChange={(e) => setFilterCanal(e.target.value)}
                style={{ padding: "6px", width: "140px" }}
              >
                <option value="">Todos</option>
                {canalValues.map((c) => (
                  <option key={c} value={String(c)}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div>Calidad de señal</div>
              <select
                value={filterRssi}
                onChange={(e) => setFilterRssi(e.target.value)}
                style={{ padding: "6px", width: "180px" }}
              >
                <option value="all">Todas</option>
                <option value="good">Buena (&gt; -75 dBm)</option>
                <option value="warn">Aceptable (-75 a -85 dBm)</option>
                <option value="bad">Crítica (&lt; -85 dBm)</option>
              </select>
            </div>
          </div>

          {/* Tabla */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "white",
              }}
            >
              <thead>
                <tr>
                  {Object.keys(csvPreview[0]).map((key) => (
                    <th
                      key={key}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPreview.map((row, index) => (
                  <tr key={index}>
                    {Object.entries(row).map(([k, value], i) => (
                      <td key={i} style={getRowStyle(row)}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}

                {filteredPreview.length === 0 && (
                  <tr>
                    <td
                      colSpan={Object.keys(csvPreview[0]).length}
                      style={{ padding: "10px", textAlign: "center" }}
                    >
                      No hay registros coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
