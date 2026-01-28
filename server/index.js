const initDB = require("./db/initDB");
const db = initDB();   // <-- Inicializamos BD

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());


// ================================
//        RUTAS NUEVAS
// ================================
app.use("/api/clientes", require("./routes/clientes")(db));
app.use("/api/ubicaciones", require("./routes/ubicaciones")(db));
app.use("/api/proyectos", require("./routes/proyectos")(db));
app.use("/api/incidencias", require("./routes/incidencias")(db));
app.use("/api/importar-csv", require("./routes/importarCSV")(db));
app.use("/api/mediciones", require("./routes/mediciones")(db));  


// ====================================================================
//    CRUD ANTIGUOS (SIGUEN FUNCIONANDO)
// ====================================================================

// CRUD CLIENTES
app.post("/api/clientes", (req, res) => {
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

app.get("/api/clientes", (req, res) => {
  db.all(`SELECT * FROM clientes`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// CRUD UBICACIONES
app.post("/api/ubicaciones", (req, res) => {
  const { cliente_id, nombre, direccion } = req.body;
  if (!cliente_id || !nombre) {
    return res.status(400).json({ error: "cliente_id y nombre requeridos" });
  }

  db.run(
    `INSERT INTO ubicaciones (cliente_id, nombre, direccion) VALUES (?, ?, ?)`,
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

app.get("/api/ubicaciones", (req, res) => {
  db.all(`SELECT * FROM ubicaciones`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// CRUD PROYECTOS
app.post("/api/proyectos", (req, res) => {
  const { ubicacion_id, nombre, fecha } = req.body;
  if (!ubicacion_id || !nombre) {
    return res
      .status(400)
      .json({ error: "ubicacion_id y nombre requeridos" });
  }

  db.run(
    `INSERT INTO proyectos (ubicacion_id, nombre, fecha) VALUES (?, ?, ?)`,
    [ubicacion_id, nombre, fecha || new Date().toISOString()],
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

app.get("/api/proyectos", (req, res) => {
  db.all(`SELECT * FROM proyectos`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// ============================================================
//   SUBIDA CSV ANTIGUA (PUEDES BORRARLA MÁS ADELANTE)
// ============================================================
const upload = multer({ dest: "uploads/" });

app.post("/api/upload-csv", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se envió ningún archivo" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const valores = Object.values(row).join("").trim();
      if (valores !== "") {
        results.push(row);
      }
    })
    .on("end", () => {
      fs.unlinkSync(req.file.path);
      res.json({ ok: true, data: results });
    })
    .on("error", (err) => {
      console.error("Error procesando CSV:", err);
      res.status(500).json({ error: "Error procesando CSV" });
    });
});


// ============================================================
//  INICIAR SERVIDOR
// ============================================================
app.listen(4000, () => {
  console.log("Servidor backend escuchando en puerto 4000");
});
