// src/pages/Incidencias/Incidencias.jsx
import { useState, useEffect } from "react";
import "./Incidencias.css";

export default function Incidencias({ projectId, selectedLocation }) {
  const [incidencias, setIncidencias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    tipo: "Leve",
    descripcion: "",
    foto: "",
    ubicacion: "",
  });

  // ⭐ NUEVO: abrir formulario automáticamente al seleccionar punto del mapa
  useEffect(() => {
    if (selectedLocation) {
      setFormData((prev) => ({
        ...prev,
        ubicacion: selectedLocation,
      }));
      setShowForm(true);
    }
  }, [selectedLocation]);

  // ⭐⭐⭐ CLAVE FIJA PARA LEER INCIDENCIAS AUTOMÁTICAS DEL CSV ⭐⭐⭐
  const storageKey = `incidencias_Proyecto Wi-Fi`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setIncidencias(JSON.parse(saved));
    }
  }, [storageKey]);

  function handleSave() {
    let updated = [];

    if (editId) {
      updated = incidencias.map((inc) =>
        inc.id === editId ? { ...inc, ...formData } : inc
      );
    } else {
      const nueva = { id: Date.now(), ...formData };
      updated = [...incidencias, nueva];
    }

    setIncidencias(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setFormData({
      tipo: "Leve",
      descripcion: "",
      foto: "",
      ubicacion: "",
    });

    setEditId(null);
    setShowForm(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete(id) {
    if (!confirm("¿Eliminar esta incidencia?")) return;

    const filtered = incidencias.filter((inc) => inc.id !== id);
    setIncidencias(filtered);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  }

  function handleEdit(inc) {
    setFormData({
      tipo: inc.tipo,
      descripcion: inc.descripcion,
      foto: inc.foto,
      ubicacion: inc.ubicacion,
    });
    setEditId(inc.id);
    setShowForm(true);
  }

  return (
    <div className="incidencias-container">
      <h1>Incidencias del proyecto</h1>

      <button className="btn-new" onClick={() => setShowForm(true)}>
        Registrar nueva incidencia
      </button>

      {showForm && (
        <div className="form-box">
          <h2 className="form-title">
            {editId ? "Editar incidencia" : "Nueva incidencia"}
          </h2>

          <label className="form-label">Tipo:</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Leve">Leve</option>
            <option value="Media">Media</option>
            <option value="Crítica">Crítica</option>
          </select>

          <label className="form-label">Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-textarea"
          ></textarea>

          <label className="form-label">Foto (URL):</label>
          <input
            type="text"
            name="foto"
            value={formData.foto}
            onChange={handleChange}
            className="form-input"
          />

          <label className="form-label">Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="form-input"
          />

          <button className="btn-save" onClick={handleSave}>
            {editId ? "Guardar cambios" : "Guardar"}
          </button>

          <button
            className="btn-cancel"
            onClick={() => {
              setShowForm(false);
              setEditId(null);
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      {incidencias.length === 0 ? (
        <p className="no-incidencias">
          No hay incidencias registradas en este proyecto.
        </p>
      ) : (
        <ul className="lista-incidencias">
          {incidencias.map((inc) => (
            <li key={inc.id} className="inc-item">
              <strong>{inc.tipo}</strong> — {inc.descripcion}
              <br />

              {inc.ubicacion && <em>Ubicación: {inc.ubicacion}</em>}

              {inc.foto && (
                <div>
                  <img src={inc.foto} className="thumb" alt="Foto incidencia" />
                </div>
              )}

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button className="btn-edit" onClick={() => handleEdit(inc)}>
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(inc.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}