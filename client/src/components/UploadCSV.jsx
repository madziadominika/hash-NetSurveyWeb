import { useState } from "react";

export default function UploadCSV({ setCsvData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);  // ⬅ NUEVO: datos locales solo para visualizar

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

    const res = await fetch("http://localhost:4000/upload-csv", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    // ⬅ Actualiza datos globales (para el informe)
    setCsvData(result.data);

    // ⬅ Actualiza datos locales (para mostrar tabla arriba)
    setCsvPreview(result.data);

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

      {/* ⬇⬇⬇ AQUI APARECE EL RECUADRO CON LA TABLA CSV */}
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
          <h2 style={{ marginBottom: "20px" }}>Datos Importados</h2>

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
                        textTransform: "capitalize",
                      }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {csvPreview.map((row, index) => (
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
        </div>
      )}
    </div>
  );
}
