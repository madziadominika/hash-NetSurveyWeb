import { useState, useEffect } from "react";
import "../ReportPrint.css";
import logo from "../assets/logo.png";
import { summarizeFsplByLocation } from "../utils/fspl";

export default function ReportView({
  csvData = [],
  projectInfo = {},
  hasPlano = false,
}) {
  const canalKey = Object.keys(csvData[0] || {}).find(
    (k) => k.toLowerCase() === "canal"
  );
  const timestampKey = Object.keys(csvData[0] || {}).find(
    (k) => k.toLowerCase() === "timestamp"
  );

  const totalLecturas = csvData.length;

  const puntosUnicos = new Set(
    csvData.map((row) => row.BSSID || row.SSID)
  ).size;

  const fechaAnalisis =
    csvData.length > 0 && timestampKey
      ? String(csvData[0][timestampKey]).split(" ")[0]
      : "—";

  const bandas = new Set(
    csvData
      .map((row) => {
        const canal = Number(row[canalKey]);
        if (canal <= 14) return "2.4 GHz";
        if (canal >= 30) return "5 GHz";
        return null;
      })
      .filter(Boolean)
  );

  const fsplResumen = summarizeFsplByLocation(csvData);

  const canalCounts = {};
  csvData.forEach((row) => {
    const canal = Number(row[canalKey]);
    if (!isNaN(canal)) {
      canalCounts[canal] = (canalCounts[canal] || 0) + 1;
    }
  });

  const canales2_4 = Object.keys(canalCounts)
    .map(Number)
    .filter((c) => c <= 14);

  const canales5g = Object.keys(canalCounts)
    .map(Number)
    .filter((c) => c >= 30);

  const mejorCanal24 =
    canales2_4.length > 0
      ? canales2_4.reduce((a, b) =>
          canalCounts[a] < canalCounts[b] ? a : b
        )
      : null;

  const mejorCanal5 =
    canales5g.length > 0
      ? canales5g.reduce((a, b) =>
          canalCounts[a] < canalCounts[b] ? a : b
        )
      : null;

  const rssiValues = csvData
    .map((r) => Number(r.RSSI))
    .filter((n) => !isNaN(n));

  const avgRSSI = rssiValues.length
    ? Math.round(rssiValues.reduce((a, b) => a + b, 0) / rssiValues.length)
    : null;

  let apRecomendados = 1;
  if (avgRSSI < -70) apRecomendados = 2;
  if (avgRSSI < -80) apRecomendados = 3;

  const zonasDebiles = csvData
    .filter((r) => Number(r.RSSI) < -75)
    .map((r) => r.Ubicacion || r.ubicacion)
    .filter(Boolean);

  const zonasUnicasDebiles = [...new Set(zonasDebiles)];

  const buildGenericBoq = () => [
    { item: "AP Wi-Fi profesional", cantidad: apRecomendados, precio: 95 },
    { item: "Switch PoE 8p", cantidad: 1, precio: 75 },
    { item: "Cable Cat6 (m)", cantidad: 40, precio: 0.6 },
    { item: "Tomas RJ45", cantidad: 8, precio: 4.5 },
    { item: "Configuración básica", cantidad: 1, precio: 80 },
  ];

  const buildOfficeBoq = () => [
    { item: "Rack mural 12U", cantidad: 1, precio: 180 },
    { item: "Switch PoE 24p", cantidad: 1, precio: 230 },
    { item: "AP Wi-Fi profesional", cantidad: 2, precio: 95 },
    { item: "Cámara IP PoE", cantidad: 1, precio: 65 },
    { item: "Puestos Open Space", cantidad: 20, precio: 75 },
    { item: "Puesto recepción", cantidad: 1, precio: 80 },
    { item: "Impresora red", cantidad: 1, precio: 150 },
    { item: "Punto sala reuniones", cantidad: 1, precio: 120 },
    { item: "Tomas RJ45 dobles", cantidad: 27, precio: 9 },
    { item: "Cable Cat6 datos (m)", cantidad: 180, precio: 0.6 },
    { item: "Cable Cat6 PoE (m)", cantidad: 60, precio: 1.1 },
    { item: "Canaleta PVC (m)", cantidad: 35, precio: 3 },
    { item: "Configuración y pruebas finales", cantidad: 1, precio: 150 },
  ];

  const [boq, setBoq] = useState(() =>
    hasPlano ? buildOfficeBoq() : buildGenericBoq()
  );

  useEffect(() => {
    setBoq(hasPlano ? buildOfficeBoq() : buildGenericBoq());
  }, [hasPlano]);

  const totalBOQ = boq
    .reduce((sum, item) => sum + item.cantidad * item.precio, 0)
    .toFixed(2);

  const updateBoqField = (index, field, value) => {
    const updated = [...boq];

    if (field === "item") {
      updated[index].item = value;
    } else {
      const num = Number(value);
      if (isNaN(num)) return;
      updated[index][field] = num;
    }

    setBoq(updated);
  };

  const addBoqRow = () =>
    setBoq((prev) => [...prev, { item: "Nuevo concepto", cantidad: 1, precio: 0 }]);

  const removeBoqRow = (index) =>
    setBoq((prev) => prev.filter((_, i) => i !== index));

  return (
    <div id="report-page">
      <div id="report-container">
        <div className="report-header">
          <img src={logo} alt="Logo" className="logo" />
          <div className="header-text">
            <h1 className="title">NetSurvey Web</h1>
            <p className="subtitle">Informe de auditoría Wi-Fi</p>
          </div>
        </div>

        <hr className="separator" />

        <div className="box">
          <h2 className="box-title">Datos del proyecto</h2>
          <ul className="info-list">
            <li><strong>Cliente:</strong> {projectInfo.cliente || "—"}</li>
            <li><strong>Ubicación:</strong> {projectInfo.ubicacion || "—"}</li>
            <li><strong>Proyecto:</strong> {projectInfo.proyecto || "—"}</li>
            <li><strong>Fecha:</strong> {projectInfo.fecha || fechaAnalisis}</li>
            <li><strong>Lecturas del CSV:</strong> {totalLecturas}</li>
            <li><strong>Puntos detectados:</strong> {puntosUnicos}</li>
            <li><strong>Bandas utilizadas:</strong> {[...bandas].join(" y ")}</li>
          </ul>
        </div>

        {fsplResumen && fsplResumen.length > 0 && (
          <div className="box table-box">
            <h3 className="box-title">Cálculo FSPL por ubicación</h3>

            <table className="styled-table">
              <thead>
                <tr>
                  <th>Ubicación</th>
                  <th>Frecuencias (MHz)</th>
                  <th>FSPL (dB)</th>
                </tr>
              </thead>

              <tbody>
                {fsplResumen.map((item, i) => (
                  <tr key={i}>
                    <td>{item.ubicacion}</td>
                    <td>{item.frequenciesText || "—"}</td>
                    <td>{item.fsplText || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="section-title">Recomendaciones técnicas</h3>

        <ul className="reco-list">
          <li><strong>Mejor canal (2.4 GHz):</strong> {mejorCanal24 ?? "N/D"}</li>
          <li><strong>Mejor canal (5 GHz):</strong> {mejorCanal5 ?? "N/D"}</li>
          <li><strong>Puntos de acceso recomendados:</strong> {apRecomendados}</li>
          {zonasUnicasDebiles.length > 0 ? (
            <li><strong>Zonas con señal débil:</strong> {zonasUnicasDebiles.join(", ")}</li>
          ) : (
            <li>No se detectan zonas con señal débil.</li>
          )}
        </ul>

        <div className="box table-box">
          <h3 className="box-title">Presupuesto (BOQ)</h3>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Cantidad</th>
                <th>Precio unidad (€)</th>
                <th>Subtotal (€)</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {boq.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => updateBoqField(i, "item", e.target.value)}
                      className="boq-input"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateBoqField(i, "cantidad", e.target.value)
                      }
                      className="boq-input"
                      style={{ maxWidth: "100px", textAlign: "center" }}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={item.precio}
                      onChange={(e) =>
                        updateBoqField(i, "precio", e.target.value)
                      }
                      className="boq-input"
                      style={{ maxWidth: "100px", textAlign: "center" }}
                    />
                  </td>

                  <td>{(item.cantidad * item.precio).toFixed(2)}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => removeBoqRow(i)}
                      style={{
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="total-row">
                <td></td>
                <td></td>
                <td><strong>Total (€)</strong></td>
                <td><strong>{totalBOQ}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <button
            type="button"
            onClick={addBoqRow}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Añadir concepto
          </button>
        </div>

        <div className="box" style={{ marginTop: "40px" }}>
          <h3 className="box-title">Conclusión</h3>

          <textarea
            defaultValue="La red Wi-Fi presenta un rendimiento general correcto. Se proponen mejoras para optimizar la cobertura y la estabilidad del sistema."
            style={{
              width: "100%",
              minHeight: "160px",
              fontSize: "20px",
              lineHeight: "1.6",
              borderRadius: "12px",
              border: "2px solid #000",
              background: "#f5f5f5",
              color: "#000",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        <button className="print-btn" onClick={() => window.print()}>
          Imprimir informe
        </button>
      </div>
    </div>
  );
}
