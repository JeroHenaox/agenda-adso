// Capa de acceso a la API de Agenda ADSO.
// Aquí se concentran las peticiones al servidor.

import { API_BASE_URL } from "./config";

// Obtener todos los contactos
export async function listarContactos() {
  const res = await fetch(API_BASE_URL);

  if (!res.ok) {
    throw new Error("Error al listar contactos");
  }

  return res.json();
}

// Crear un nuevo contacto
export async function crearContacto(nuevoContacto) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoContacto),
  });

  if (!res.ok) {
    throw new Error("Error al crear el contacto");
  }

  return res.json();
}

// Eliminar un contacto por su ID
export async function eliminarContactoPorId(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el contacto");
  }

  return true;
}