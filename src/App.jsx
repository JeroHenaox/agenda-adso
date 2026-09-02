import { useState, useEffect } from "react";
import FormularioContacto from "./Components/FormularioContacto";
import ContactoCard from "./Components/ContactoCard";
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
} from "./api.js";

export default function App() {
  // Estado de los contactos
  const [contactos, setContactos] = useState([]);

  // Estado para mostrar errores al usuario
  const [error, setError] = useState("");

  // GET - Cargar contactos desde JSON Server
  useEffect(() => {
    listarContactos()
      .then((data) => setContactos(data))
      .catch((error) => {
        console.error(error);

        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté funcionando e intenta nuevamente."
        );
      });
  }, []);

  // POST - Agregar contacto
  const agregarContacto = async (nuevo) => {
    try {
      setError("");

      const contactoCreado = await crearContacto(nuevo);

      setContactos((prev) => [...prev, contactoCreado]);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar el contacto. Verifica que el servidor esté funcionando e intenta nuevamente."
      );
    }
  };

  // DELETE - Eliminar contacto
  const eliminarContacto = async (id) => {
    try {
      setError("");

      await eliminarContactoPorId(id);

      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el contacto. Verifica que el servidor esté funcionando e intenta nuevamente."
      );
    }
  };

  return (
    <main className="min-h-screen py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
        Agenda ADSO v6
      </h1>

      <div className="max-w-4xl mx-auto">

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Formulario */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <FormularioContacto onAgregar={agregarContacto} />
        </section>

        {/* Lista de contactos */}
        <section className="space-y-4">
          {contactos.map((c) => (
            <ContactoCard
              key={c.id}
              {...c}
              onEliminar={() => eliminarContacto(c.id)}
            />
          ))}
        </section>

      </div>
    </main>
  );
}