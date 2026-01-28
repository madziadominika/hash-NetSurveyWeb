// src/pages/Proyectos.jsx
import { useEffect, useState } from "react";

export default function Proyectos() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  const [ubicacionId, setUbicacionId] = useState("");
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [editId, setEditId] = useState(null);

  async function cargarUbicaciones() {
    const res = await fetch("http://localhost:4000/api/ubicaciones");
    const data = await res.json();
    setUbicaciones(data);
  }

  async function cargarProyectos() {
    const res = await fetch("http://localhost:4000/api/proyectos");
    const data = await res.json();
    setProyectos(data);
  }

  useEffect(() => {
    cargarUbicaciones();
    cargarProyectos();
  }, []);

  async function guardarProyecto() {
    if (!ubicacionId || !nombre.trim()) return alert("Faltan datos");

    if (editId) {
      await fetch(`http://localhost:4000/api/proyectos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ubicacion_id: ubicacionId,
          nombre,
          fecha,
        }),
      });
    } else {
      await fetch("http://localhost:4000/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ubicacion_id: ubicacionId,
          nombre,
          fecha,
        }),
      });
    }

    setUbicacionId("");
    setNombre("");
    setFecha("");
    setEditId(null);
    cargarProyectos();
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar proyecto?")) return;
    await fetch(`http://localhost:4000/api/proyectos/${id}`, {
      method: "DELETE",
    });
    cargarProyectos();
  }

  return (
    <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
      <h1>Gestión de Proyectos</h1>

      <div style={{ marginBottom: "25px" }}>
        <select
          value={ubicacionId}
          onChange={(e) => setUbicacionId(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", width: "250px" }}
        >
          <option value="">Seleccionar ubicación</option>
          {ubicaciones.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "250px",
          }}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={guardarProyecto}
          style={{
            padding: "10px 20px",
            background: "#4caf50",
            border: "none",
            borderRadius: "6px",
          }}
        >
          {editId ? "Guardar cambios" : "Añadir proyecto"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {proyectos.map((p) => (
          <li
            key={p.id}
            style={{
              background: "#111",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <strong>{p.nombre}</strong>  
            <div>Ubicación #{p.ubicacion_id}</div>
            <div>Fecha: {p.fecha}</div>

            <div style={{ marginTop: "10px" }}>
              <button
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setUbicacionId(p.ubicacion_id);
                  setNombre(p.nombre);
                  setFecha(p.fecha);
                  setEditId(p.id);
                }}
              >
                ✏️ Editar
              </button>
              <button onClick={() => eliminar(p.id)}>🗑️ Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
