const API_URL = "http://localhost:3000/api/alumnos";
const form = document.getElementById("alumnoForm");
const tabla = document.querySelector("#tablaAlumnos tbody");
const formTitle = document.getElementById("formTitle");
const btnSubmit = document.getElementById("btnSubmit");
const btnCancelar = document.getElementById("btnCancelar");
const btnEliminarTodo = document.getElementById("btnEliminarTodo");

let editando = false;

// 🔹 Cargar alumnos al iniciar la página
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Página cargada, obteniendo alumnos...");
  await obtenerAlumnos();
  await testConexion();
});

// 🔹 Test de conexión
async function testConexion() {
  try {
    const res = await fetch("http://localhost:3000/api/health");
    const data = await res.json();
    console.log("Conexión con servidor: OK", data);
    
    // Mostrar estado en la página
    if (data.base_datos && data.base_datos === "DESCONECTADA") {
      console.warn("⚠️ Base de datos no disponible");
    }
  } catch (err) {
    console.error("Error de conexión con servidor:", err);
    alert("⚠️ No se puede conectar al servidor. Verifica que esté ejecutándose.");
  }
}

// 🔹 Manejar envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("alumnoId").value;
  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value.trim();
  const curso = document.getElementById("curso").value.trim();

  if (!nombre || !edad) {
    alert("Por favor ingresa nombre y edad.");
    return;
  }

  try {
    console.log(editando ? "Editando alumno..." : "Creando alumno...");
    
    let res;
    if (editando) {
      // Actualizar alumno existente
      res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, edad: parseInt(edad), curso })
      });
    } else {
      // Crear nuevo alumno
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, edad: parseInt(edad), curso })
      });
    }

    console.log("Respuesta del servidor:", res.status);
    
    if (res.ok) {
      const data = await res.json();
      alert(editando ? "Alumno actualizado correctamente" : "Alumno agregado correctamente");
      resetForm();
      await obtenerAlumnos();
    } else {
      const errorData = await res.json();
      console.error("Error del servidor:", errorData);
      alert("Error: " + (errorData.error || "Error desconocido"));
    }
  } catch (err) {
    console.error("Error de conexión:", err);
    alert("❌ Error de conexión con el servidor. Verifica la consola para más detalles.");
  }
});

// 🔹 Función para obtener lista de alumnos (GET)
async function obtenerAlumnos() {
  try {
    console.log("Obteniendo alumnos desde:", API_URL);
    const res = await fetch(API_URL);
    
    console.log("Status de respuesta:", res.status);
    console.log("OK?", res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`Error HTTP: ${res.status} - ${errorText}`);
    }
    
    const alumnos = await res.json();
    console.log(`Alumnos recibidos: ${alumnos.length}`, alumnos);
    
    tabla.innerHTML = "";

    if (alumnos.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">
            No hay alumnos registrados
          </td>
        </tr>`;
      return;
    }

    alumnos.forEach(a => {
      const fila = document.createElement('tr');
      
      // Crear celdas de forma segura
      const tdNombre = document.createElement('td');
      tdNombre.textContent = a.nombre || '';
      
      const tdEdad = document.createElement('td');
      tdEdad.textContent = a.edad || '';
      
      const tdCurso = document.createElement('td');
      tdCurso.textContent = a.curso || '';
      
      const tdAcciones = document.createElement('td');
      
      // Botón Editar
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn btn-warning btn-sm me-1';
      btnEditar.textContent = 'Editar';
      btnEditar.onclick = () => editarAlumno(a.id, a.nombre, a.edad, a.curso);
      
      // Botón Eliminar
      const btnEliminar = document.createElement('button');
      btnEliminar.className = 'btn btn-danger btn-sm';
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.onclick = () => eliminarAlumno(a.id);
      
      tdAcciones.appendChild(btnEditar);
      tdAcciones.appendChild(btnEliminar);
      
      fila.appendChild(tdNombre);
      fila.appendChild(tdEdad);
      fila.appendChild(tdCurso);
      fila.appendChild(tdAcciones);
      
      tabla.appendChild(fila);
    });
  } catch (err) {
    console.error("Error al cargar alumnos:", err);
    tabla.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger">
          ❌ Error al cargar los alumnos: ${err.message}
        </td>
      </tr>`;
  }
}

// 🔹 Función para editar alumno
function editarAlumno(id, nombre, edad, curso) {
  document.getElementById("alumnoId").value = id;
  document.getElementById("nombre").value = nombre || '';
  document.getElementById("edad").value = edad || '';
  document.getElementById("curso").value = curso || '';
  
  editando = true;
  formTitle.textContent = "Editar alumno";
  btnSubmit.textContent = "Actualizar";
  btnCancelar.style.display = "inline-block";
  
  // Scroll al formulario
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

// 🔹 Función para eliminar alumno
async function eliminarAlumno(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este alumno?")) {
    return;
  }

  try {
    console.log(`Eliminando alumno ID: ${id}`);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    console.log("Respuesta DELETE:", res.status);
    
    if (res.ok) {
      const data = await res.json();
      alert("Alumno eliminado correctamente");
      await obtenerAlumnos();
    } else {
      const errorData = await res.json();
      console.error("Error del servidor:", errorData);
      alert("Error: " + (errorData.error || "Error al eliminar"));
    }
  } catch (err) {
    console.error("Error de conexión:", err);
    alert("❌ Error de conexión con el servidor");
  }
}

// 🔹 Función para eliminar todos los alumnos
btnEliminarTodo.addEventListener("click", async () => {
  if (!confirm("¿Estás seguro de que quieres eliminar TODOS los alumnos? Esta acción no se puede deshacer.")) {
    return;
  }

  try {
    console.log("Eliminando todos los alumnos...");
    const res = await fetch(`${API_URL}`, {
      method: "DELETE"
    });

    console.log("Respuesta DELETE ALL:", res.status);
    
    if (res.ok) {
      const data = await res.json();
      alert("Todos los alumnos han sido eliminados");
      await obtenerAlumnos();
    } else {
      const errorData = await res.json();
      console.error("Error del servidor:", errorData);
      alert("Error: " + (errorData.error || "Error al eliminar todos"));
    }
  } catch (err) {
    console.error("Error de conexión:", err);
    alert("❌ Error de conexión con el servidor");
  }
});

// 🔹 Cancelar edición
btnCancelar.addEventListener("click", resetForm);

// 🔹 Función para resetear el formulario
function resetForm() {
  editando = false;
  document.getElementById("alumnoId").value = "";
  form.reset();
  formTitle.textContent = "Agregar alumno";
  btnSubmit.textContent = "Agregar";
  btnCancelar.style.display = "none";
}