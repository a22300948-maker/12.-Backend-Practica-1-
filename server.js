import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Datos en memoria (para desarrollo)
let alumnos = [
  { id: 1, nombre: "Ana García", edad: 20, curso: "Matemáticas" },
  { id: 2, nombre: "Luis Martínez", edad: 22, curso: "Historia" },
  { id: 3, nombre: "Marta Rodríguez", edad: 19, curso: "Programación" }
];
let nextId = 4;

// GET todos los alumnos
app.get("/api/alumnos", (req, res) => {
  console.log("📖 GET /api/alumnos - Enviando", alumnos.length, "alumnos");
  res.json(alumnos);
});

// POST nuevo alumno
app.post("/api/alumnos", (req, res) => {
  const { nombre, edad, curso } = req.body;
  console.log("📝 POST /api/alumnos:", { nombre, edad, curso });
  
  if (!nombre || !edad) {
    return res.status(400).json({ error: "Nombre y edad son requeridos" });
  }
  
  const nuevoAlumno = { 
    id: nextId++, 
    nombre, 
    edad: parseInt(edad), 
    curso: curso || '' 
  };
  alumnos.push(nuevoAlumno);
  
  res.json({ 
    mensaje: "Alumno agregado correctamente", 
    id: nuevoAlumno.id 
  });
});

// PUT actualizar alumno
app.put("/api/alumnos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, edad, curso } = req.body;
  console.log(`✏️ PUT /api/alumnos/${id}:`, { nombre, edad, curso });
  
  const index = alumnos.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }
  
  alumnos[index] = { 
    ...alumnos[index], 
    nombre, 
    edad: parseInt(edad), 
    curso: curso || '' 
  };
  
  res.json({ mensaje: "Alumno actualizado correctamente" });
});

// DELETE alumno
app.delete("/api/alumnos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`🗑️ DELETE /api/alumnos/${id}`);
  
  const index = alumnos.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }
  
  alumnos.splice(index, 1);
  res.json({ mensaje: "Alumno eliminado correctamente" });
});

// DELETE todos
app.delete("/api/alumnos", (req, res) => {
  console.log("🔥 DELETE /api/alumnos - Eliminando todos");
  alumnos = [];
  nextId = 1;
  res.json({ mensaje: "Todos los alumnos han sido eliminados" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    mensaje: "Servidor funcionando con datos en memoria",
    alumnos_registrados: alumnos.length
  });
});

app.use(express.static("."));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Usando datos en memoria - ${alumnos.length} alumnos cargados`);
  console.log(`💡 Ve a http://localhost:${PORT} para usar la aplicación\n`);
});