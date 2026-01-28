module.exports = (db) => {
  const express = require("express");
  const router = express.Router();
  const multer = require("multer");
  const csv = require("csv-parser");
  const fs = require("fs");

  // Carpeta temporal para subir CSV
  const upload = multer({ dest: "uploads/" });

  // =====================================
  // IMPORTAR CSV Y GUARDAR EN BD
  // =====================================
  router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo" });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        // Ignorar filas vacías
        const valores = Object.values(row).join("").trim();
        if (valores === "") return;

        results.push(row);
      })
      .on("end", () => {
        // Borrar archivo temporal
        fs.unlinkSync(req.file.path);

        // PROYECTO FIJO (solución al error NOT NULL)
        const proyectoId = 1;

        const insertQuery = `
          INSERT INTO mediciones_wifi (
            proyecto_id, ssid, bssid, canal, rssi, x, y, fecha_importacion
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;

        // Guardar cada fila en la BD
        results.forEach((r) => {
          db.run(
            insertQuery,
            [
              proyectoId,         
              r.ssid || "",
              r.bssid || "",
              r.canal || "",
              r.rssi || "",
              r.x || null,
              r.y || null,
            ],
            (err) => {
              if (err) console.error("Error insertando fila CSV:", err);
            }
          );
        });

        res.json({
          ok: true,
          guardadas: results.length,
        });
      })
      .on("error", (err) => {
        console.error("Error procesando CSV:", err);
        res.status(500).json({ error: "Error procesando CSV" });
      });
  });

  return router;
};
