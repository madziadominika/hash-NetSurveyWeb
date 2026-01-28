const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // ===========================
  // GET TODAS LAS INCIDENCIAS
  // ===========================
  router.get("/", (req, res) => {
    db.all(`SELECT * FROM incidencias`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ===========================
  // GET INCIDENCIAS POR PROYECTO
  // ===========================
  router.get("/:projectId", (req, res) => {
    db.all(
      `SELECT * FROM incidencias WHERE proyecto_id = ?`,
      [req.params.projectId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // ===========================
  // CREAR INCIDENCIA
  // ===========================
  router.post("/", (req, res) => {

    console.log("BACKEND RECIBE:", req.body);

    const { proyecto_id, tipo, descripcion, foto, ubicacion } = req.body;

    db.run(
      `INSERT INTO incidencias (proyecto_id, tipo, descripcion, foto, ubicacion)
       VALUES (?, ?, ?, ?, ?)`,
      [proyecto_id, tipo, descripcion, foto, ubicacion],
      function (err) {
        if (err) {
          console.log("ERROR SQL:", err.message);
          return res.status(500).json({ error: err.message });
        }

        res.json({
          id: this.lastID,
          proyecto_id,
          tipo,
          descripcion,
          foto,
          ubicacion,
        });
      }
    );
  });

  // ===========================
  // ELIMINAR INCIDENCIA
  // ===========================
  router.delete("/:id", (req, res) => {
    db.run(
      `DELETE FROM incidencias WHERE id = ?`,
      [req.params.id],
      (err) => {
        if (err) {
          console.log("ERROR AL ELIMINAR:", err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ ok: true, id: req.params.id });
      }
    );
  });

  return router;
};
