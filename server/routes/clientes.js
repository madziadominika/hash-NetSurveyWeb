const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Obtener todos
  router.get("/", (req, res) => {
    db.all(`SELECT * FROM clientes`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Crear
  router.post("/", (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    db.run(
      `INSERT INTO clientes (nombre) VALUES (?)`,
      [nombre],
      function () {
        res.json({ id: this.lastID, nombre });
      }
    );
  });

  return router;
};
