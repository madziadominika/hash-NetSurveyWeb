// src/pages/Clientes.jsx
import { useEffect, useState } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);

  async function cargarClientes() {
    const res = await fetch("http://localhost:4000/api/clientes");
    const data = await res.json();
    setClientes(data);
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  async function guardarCliente() {
    if (!nombre.trim()) return alert("Nombre requerido");

    if (editId) {
      await fetch(`http://localhost:4000/api/clientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
    } else {
      await fetch("http://localhost:4000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
    }

    setNombre("");
    setEditId(null);
    cargarClientes();
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar cliente?")) return;
    await fetch(`http://localhost:4000/api/clientes/${id}`, {
      method: "DELETE",
    });
    cargarClientes();
  }

  return (
    <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
      <h1>Gestión de Clientes</h1>

      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "280px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={guardarCliente}
          style={{
            padding: "10px 20px",
            background: "#4caf50",
            border: "none",
            borderRadius: "6px",
          }}
        >
          {editId ? "Guardar cambios" : "Añadir cliente"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {clientes.map((c) => (
          <li
            key={c.id}
            style={{
              background: "#111",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <strong>{c.nombre}</strong>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => {
                  setNombre(c.nombre);
                  setEditId(c.id);
                }}
                style={{ marginRight: "10px" }}
              >
                ✏️ Editar
              </button>
              <button onClick={() => eliminar(c.id)}>🗑️ Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
