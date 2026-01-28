module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  // ============================================
  // OBTENER TODAS LAS MEDICIONES
  // ============================================
  router.get("/", (req, res) => {
    const query = "SELECT * FROM mediciones";  // <-- TABLA CORRECTA

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("❌ Error consultando mediciones:", err);
        return res.status(500).json({ error: "Error consultando mediciones" });
      }

      res.json({
        ok: true,
        total: rows.length,
        data: rows,
      });
    });
  });

  // ============================================
  // OBTENER MEDICIONES POR PROYECTO
  // ============================================
  router.get("/proyecto/:id", (req, res) => {
    const proyectoId = req.params.id;

    const query = `
      SELECT *
      FROM mediciones
      WHERE proyecto_id = ?
      ORDER BY id ASC
    `;

    db.all(query, [proyectoId], (err, rows) => {
      if (err) {
        console.error("❌ Error consultando mediciones por proyecto:", err);
        return res.status(500).json({ error: "Error consultando mediciones" });
      }

      res.json({
        ok: true,
        proyecto_id: proyectoId,
        total: rows.length,
        data: rows,
      });
    });
  });

  // ============================================
  // INSERTAR MEDICIÓN
  // ============================================
  router.post("/", (req, res) => {
    const { proyecto_id, ssid, canal, rssi, x, y } = req.body;

    const query = `
      INSERT INTO mediciones (proyecto_id, ssid, canal, rssi, x, y)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [proyecto_id, ssid, canal, rssi, x, y],
      function (err) {
        if (err) {
          console.error("❌ Error insertando medición:", err);
          return res.status(500).json({ error: "Error insertando medición" });
        }

        res.json({
          ok: true,
          id: this.lastID,
          proyecto_id,
          ssid,
          canal,
          rssi,
          x,
          y,
        });
      }
    );
  });

  return router;
};
