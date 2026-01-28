-- ===============================
-- TABLA CLIENTES
-- ===============================
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- ===============================
-- TABLA UBICACIONES
-- ===============================
CREATE TABLE IF NOT EXISTS ubicaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    direccion TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- ===============================
-- TABLA PROYECTOS
-- ===============================
CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ubicacion_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    fecha TEXT,
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id)
);

-- ===============================
-- TABLA INCIDENCIAS (CORREGIDA)
-- ===============================
CREATE TABLE IF NOT EXISTS incidencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    tipo TEXT,
    descripcion TEXT,
    foto TEXT,
    ubicacion TEXT,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
);

-- ===============================
-- TABLA MEDICIONES
-- ===============================
CREATE TABLE IF NOT EXISTS mediciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    ssid TEXT,
    canal TEXT,
    rssi TEXT,
    x REAL,
    y REAL,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
);
