const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Ubicaciones por cliente
  router.get("/:cliente_id", (req, res) => {
    db.all(
      `SELECT * FROM ubicaciones WHERE cliente_id = ?`,
      [req.params.cliente_id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // Crear ubicación
  router.post("/", (req, res) => {
    const { cliente_id, nombre, direccion } = req.body;

    db.run(
      `INSERT INTO ubicaciones (cliente_id, nombre, direccion)
       VALUES (?, ?, ?)`,
      [cliente_id, nombre, direccion],
      function () {
        res.json({
          id: this.lastID,
          cliente_id,
          nombre,
          direccion,
        });
      }
    );
  });

  return router;
};
