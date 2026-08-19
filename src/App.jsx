import { useState, useEffect } from "react";
import "./App.css";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

export default function App() {
  // Recuperar contactos guardados en localStorage
  const contactosGuardados =
    JSON.parse(localStorage.getItem("contactos")) || [];

  // Estado inicial de los contactos
  const [contactos, setContactos] = useState(contactosGuardados);

  // Guardar los contactos cada vez que cambie el estado
  useEffect(() => {
    localStorage.setItem(
      "contactos",
      JSON.stringify(contactos)
    );
  }, [contactos]);

  // Agregar un nuevo contacto
  const agregarContacto = (nuevo) => {
    setContactos((prev) => [...prev, nuevo]);
  };

  // Eliminar contacto por correo
  const eliminarContacto = (correo) => {
    setContactos((prev) =>
      prev.filter((c) => c.correo !== correo)
    );
  };

  return (
    <main className="app-container">
      <h1 className="app-title">Agenda ADSO v3</h1>

      <FormularioContacto onAgregar={agregarContacto} />

      {contactos.map((c) => (
        <ContactoCard
          key={c.correo}
          {...c}
          onEliminar={eliminarContacto}
        />
      ))}
    </main>
  );
}