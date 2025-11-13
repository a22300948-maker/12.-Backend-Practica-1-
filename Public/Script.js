const API_URL = "http://localhost:5000/api/alumnos";
const form = document.getElementById("alumnoForm");
const tabla = document.querySelector("#tablaAlumnos tbody");

// 🔹 Cargar alumnos al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerAlumnos);

// 🔹 Manejar envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value.trim();
  const curso = document.getElementById("curso").value.trim();

  if (!nombre || !edad) {
    alert("Por favor ingresa nombre y edad.");
    return;
  }

  // Enviar datos al backend
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, edad, curso })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Alumno agregado correctamente");
      form.reset();
      obtenerAlumnos(); // recarga la tabla
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});

// 🔹 Función para obtener lista de alumnos (GET)
async function obtenerAlumnos() {
  try {
    const res = await fetch(API_URL);
    const alumnos = await res.json();
    tabla.innerHTML = "";

    alumnos.forEach(a => {
      const fila = `
        <tr>
          <td>${a.id}</td>
          <td>${a.nombre}</td>
          <td>${a.edad}</td>
          <td>${a.curso ?? ""}</td>
        </tr>`;
      tabla.insertAdjacentHTML("beforeend", fila);
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = "<tr><td colspan='4'>Error al cargar los alumnos.</td></tr>";
  }
}



