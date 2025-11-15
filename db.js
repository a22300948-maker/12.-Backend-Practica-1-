import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'escuela'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

// ... el resto del código del servidor con MySQL