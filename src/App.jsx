// Archivo: src/App.jsx
// Componente principal de la aplicación Agenda ADSO.
// Se encarga de:
// - Cargar la lista de contactos desde la API (JSON Server).
// - Manejar estados globales (contactos, carga, error).
// - Conectar el formulario, el buscador y las tarjetas de contactos.
// - Aplicar búsqueda y ordenamiento sobre la lista de contactos.

// Importamos hooks de React
import { useEffect, useState } from "react";

// Importamos las funciones de la API (capa de datos)
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
} from "./api";

// Importamos la configuración global de la aplicación
import { APP_INFO } from "./config";

// Importamos componentes hijos
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  // Estado que almacena la lista de contactos obtenidos de la API
  const [contactos, setContactos] = useState([]);

  // Estado que indica si estamos cargando información (por ejemplo, al inicio)
  const [cargando, setCargando] = useState(true);

  // Estado para guardar mensajes de error generales de la aplicación
  const [error, setError] = useState("");

  // === NUEVOS ESTADOS PARA LA CLASE 10 ===

  // Estado para el término de búsqueda digitado por el usuario
  const [busqueda, setBusqueda] = useState("");

  // Estado para el orden de los contactos:
  // true  = orden alfabético ascendente (A-Z)
  // false = orden alfabético descendente (Z-A)
  const [ordenAsc, setOrdenAsc] = useState(true);

  // useEffect que se ejecuta una sola vez al montar el componente.
  // Aquí cargamos los contactos iniciales desde JSON Server (GET).
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");

        const data = await listarContactos();
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);

        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarContactos();
  }, []);

  // Función que se encarga de agregar un nuevo contacto usando la API (POST)
  const onAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");

      const creado = await crearContacto(nuevoContacto);

      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      console.error("Error al crear contacto:", error);

      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente."
      );

      throw error;
    }
  };

  // Función para eliminar un contacto por su id (DELETE)
  const onEliminarContacto = async (id) => {
    try {
      setError("");
      await eliminarContactoPorId(id);

      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar contacto:", error);

      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor."
      );
    }
  };

  // === LÓGICA DE BÚSQUEDA Y ORDENAMIENTO (CLASE 10) ===

  // 1. Filtramos la lista original según el término de búsqueda
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();

    const nombre = c.nombre.toLowerCase();
    const correo = c.correo.toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();
    const telefono = (c.telefono || "").toLowerCase();

    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino) ||
      telefono.includes(termino)
    );
  });

  // 2. Ordenamos los contactos filtrados por nombre
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();

    if (nombreA < nombreB) {
      return ordenAsc ? -1 : 1;
    }

    if (nombreA > nombreB) {
      return ordenAsc ? 1 : -1;
    }

    return 0;
  });

  // JSX que renderiza toda la aplicación
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

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
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-gray-500">Cargando contactos...</p>
        ) : (
          <>
            <FormularioContacto onAgregar={onAgregarContacto} />

            {/* === Buscador y botón de orden === */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">

              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  placeholder="Buscar por nombre, correo o etiqueta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => setOrdenAsc((prev) => !prev)}
                className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition"
              >
                {ordenAsc ? "Ordenar Z-A ↓" : "Ordenar A-Z ↑"}
              </button>

            </div>

            {/* === Contador de resultados === */}
            <p className="text-xs text-gray-500 mb-4">
              Mostrando {contactosOrdenados.length}{" "}
              {contactosOrdenados.length === 1 ? "contacto" : "contactos"}
            </p>

            {/* Listado de contactos */}
            <section className="space-y-4">
              {contactosOrdenados.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No se encontraron contactos que coincidan con la búsqueda.
                </p>
              ) : (
                contactosOrdenados.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    etiqueta={c.etiqueta}
                    onEliminar={() => onEliminarContacto(c.id)}
                  />
                ))
              )}
            </section>
          </>
        )}

        <footer className="mt-8 text-xs text-gray-400">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
        </footer>

      </div>
    </div>
  );
}

export default App;