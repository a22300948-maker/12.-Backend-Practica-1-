import express from "express";
import cors from "cors";
import connection from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
//crear (post)
app.post("/api/alumnos", (req,res)=>{
    const{nombre, edad, curso} = req.body;
    const sql ="INSERT INTO  alumnos(nombre, edad, curso) VALUES(?,?,?)";
    connection.query(sql,[nombre, edad, curso], (err,result)=>{
        if (err) return res.status(500).json({ error: err });
        res.json({mensaje:"Alumno agregado correctamente",id:result.insertId});
    });
});
//MODELOS GET
app.get("/api/alumnos",(req,res)=>{
    connection.query("SELECT * FROM alumnos", (err, results)=>{
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});
app.use(express.static("public"));
//puerto
const PORT=5000;
app.listen(PORT, ()=>console.log(`Su contenido en http://localhost:${PORT}`));
