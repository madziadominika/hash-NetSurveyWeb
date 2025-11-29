import { useState } from "react";

export default function UploadCSV() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);

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
    formData.append("file", selectedFile); // ← CORREGIDO

    const res = await fetch("http://localhost:4000/upload-csv", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    // Guardar los datos del CSV en el estado
    setCsvData(result.data);

    alert("Archivo importado correctamente");
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>Subida de CSV</h2>

      <input
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

      <button
        onClick={handleUpload}
        style={{
          marginTop: "20px",
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

      {/* TABLA DEL CSV */}
      {csvData.length > 0 && (
        <div style={{ marginTop: "30px", overflowX: "auto" }}>
          <h3 style={{ marginBottom: "15px" }}>Datos Importados</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#111",
              color: "white",
              borderRadius: "8px",
            }}
          >
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #444",
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

