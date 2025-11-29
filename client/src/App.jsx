import { useState } from "react";
import ReportView from "./components/ReportView";
import UploadCSV from "./components/UploadCSV";
import MapView from "./components/MapView";

export default function App() {
  const [csvData, setCsvData] = useState([]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",      // centra TODO en horizontal
        justifyContent: "flex-start",
        padding: "20px",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      {/* CABECERA + CSV */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",      // ancho de la página
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          NetSurvey Web
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "40px", opacity: 0.9 }}>
          Seleccione un archivo CSV para procesar los datos de la red Wi-Fi.
        </p>

        <UploadCSV setCsvData={setCsvData} />
      </div>

      {/* MAPA */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",      // mismo ancho que el resto
          marginTop: "30px",
        }}
      >
        <MapView csvData={csvData} />
      </div>

      {/* INFORME */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",      // informe también ancho
          marginTop: "40px",
        }}
      >
        <ReportView />
      </div>
    </div>
  );
}


