// src/pages/Ubicaciones.jsx
import { useEffect, useState } from "react";

export default function Ubicaciones() {
  const [clientes, setClientes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [editId, setEditId] = useState(null);

  async function cargarClientes() {
    const res = await fetch("http://localhost:4000/api/clientes");
    const data = await res.json();
    setClientes(data);
  }

  async function cargarUbicaciones() {
    const res = await fetch("http://localhost:4000/api/ubicaciones");
    const data = await res.json();
    setUbicaciones(data);
  }

  useEffect(() => {
    cargarClientes();
    cargarUbicaciones();
  }, []);

  async function guardarUbicacion() {
    if (!clienteId || !nombre.trim()) return alert("Faltan datos");

    if (editId) {
      await fetch(`http://localhost:4000/api/ubicaciones/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: clienteId, nombre, direccion }),
      });
    } else {
      await fetch("http://localhost:4000/api/ubicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: clienteId, nombre, direccion }),
      });
    }

    setClienteId("");
    setNombre("");
    setDireccion("");
    setEditId(null);
    cargarUbicaciones();
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar ubicación?")) return;
    await fetch(`http://localhost:4000/api/ubicaciones/${id}`, {
      method: "DELETE",
    });
    cargarUbicaciones();
  }

  return (
    <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
      <h1>Gestión de Ubicaciones</h1>

      <div style={{ marginBottom: "25px" }}>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", width: "200px" }}
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre de la ubicación"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "250px",
          }}
        />

        <input
          type="text"
          placeholder="Dirección (opcional)"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "250px",
          }}
        />

        <button
          onClick={guardarUbicacion}
          style={{
            padding: "10px 20px",
            background: "#4caf50",
            border: "none",
            borderRadius: "6px",
          }}
        >
          {editId ? "Guardar cambios" : "Añadir ubicación"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {ubicaciones.map((u) => (
          <li
            key={u.id}
            style={{
              background: "#111",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <strong>{u.nombre}</strong> — Cliente #{u.cliente_id}
            {u.direccion && <div>📍 {u.direccion}</div>}

            <div style={{ marginTop: "10px" }}>
              <button
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setClienteId(u.cliente_id);
                  setNombre(u.nombre);
                  setDireccion(u.direccion);
                  setEditId(u.id);
                }}
              >
                ✏️ Editar
              </button>
              <button onClick={() => eliminar(u.id)}>🗑️ Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
