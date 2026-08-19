import { useState } from "react";

export default function FormularioContacto({ onAgregar }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: ""
  });

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!form.nombre || !form.telefono || !form.correo) {
      return;
    }

    // Enviar el contacto a App.jsx
    onAgregar(form);

    // Limpiar formulario
    setForm({
      nombre: "",
      telefono: "",
      correo: "",
      etiqueta: ""
    });
  };

  return (
    <form className="form-contacto" onSubmit={onSubmit}>
      <div className="campo">
        <label>Nombre *</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          placeholder="Ej: Ana López"
        />
      </div>

      <div className="campo">
        <label>Teléfono *</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={onChange}
          placeholder="Ej: 300 1234567"
        />
      </div>

      <div className="campo campo-full">
        <label>Correo *</label>
        <input
          name="correo"
          value={form.correo}
          onChange={onChange}
          placeholder="Ej: ana@sena.edu.co"
        />
      </div>

      <div className="campo campo-full">
        <label>Etiqueta (opcional)</label>
        <input
          name="etiqueta"
          value={form.etiqueta}
          onChange={onChange}
          placeholder="Ej: Trabajo"
        />
      </div>

      <button className="btn-primario campo-full">
        Agregar contacto
      </button>
    </form>
  );
}