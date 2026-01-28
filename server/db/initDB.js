const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// RUTAS CORRECTAS (NO añadir otro /db)
const sqlPath = path.join(__dirname, "database.sql");
const dbPath = path.join(__dirname, "database.db");

function initDB() {

  const dbExists = fs.existsSync(dbPath);
  const db = new sqlite3.Database(dbPath);

  if (!dbExists) {
    console.log("📌 Creando base de datos por primera vez...");
    const schema = fs.readFileSync(sqlPath, "utf8");

    db.exec(schema, (err) => {
      if (err) console.error(" Error inicializando BD:", err);
      else console.log(" Base de datos creada correctamente");
    });

  } else {
    console.log(" Usando base de datos existente (NO se borra nada)");
  }

  return db;
}

module.exports = initDB;
