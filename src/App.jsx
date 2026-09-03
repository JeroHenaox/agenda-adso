import { useState, useEffect } from "react";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
} from "./api.js";
import { APP_INFO } from "./config";

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState("");

  // Carga los contactos cuando inicia la aplicación.
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

  // Guarda un nuevo contacto mediante la API.
  const agregarContacto = async (nuevoContacto) => {
    try {
      setError("");

      const contactoCreado = await crearContacto(nuevoContacto);

      setContactos((prev) => [...prev, contactoCreado]);
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar el contacto. Verifica que el servidor esté funcionando e intenta nuevamente."
      );
    }
  };

  // Elimina el contacto de la API y actualiza la lista.
  const eliminarContacto = async (id) => {
    try {
      setError("");

      await eliminarContactoPorId(id);

      setContactos((prev) =>
        prev.filter((contacto) => contacto.id !== id)
      );
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo eliminar el contacto. Verifica que el servidor esté funcionando e intenta nuevamente."
      );
    }
  };

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha {APP_INFO.ficha}
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            {APP_INFO.titulo}
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            {APP_INFO.subtitulo}
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <section className="mb-8">
          <FormularioContacto onAgregar={agregarContacto} />
        </section>

        <section className="space-y-4">
          {contactos.map((contacto) => (
            <ContactoCard
              key={contacto.id}
              {...contacto}
              onEliminar={() => eliminarContacto(contacto.id)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}