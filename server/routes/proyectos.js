const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:ubicacion_id", (req, res) => {
    db.all(
      `SELECT * FROM proyectos WHERE ubicacion_id = ?`,
      [req.params.ubicacion_id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  router.post("/", (req, res) => {
    const { ubicacion_id, nombre, fecha } = req.body;

    db.run(
      `INSERT INTO proyectos (ubicacion_id, nombre, fecha)
       VALUES (?, ?, ?)`,
      [ubicacion_id, nombre, fecha],
      function () {
        res.json({
          id: this.lastID,
          ubicacion_id,
          nombre,
          fecha,
        });
      }
    );
  });

  return router;
};
