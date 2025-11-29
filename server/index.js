const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURAR MULTER PARA SUBIDA CSV ---
const upload = multer({ dest: "uploads/" });

// --- ENDPOINT PARA SUBIR CSV ---
app.post("/upload-csv", upload.single("file"), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      fs.unlinkSync(req.file.path);  // borrar archivo temporal
      res.json({ data: results });
    });
});

// --- INICIAR SERVIDOR ---
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});