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
        if(err) return res.sattus(500).json({error:err}):
        res.json({mensaje:"Alumno agregado correctamente",iol:result.insertId});
    });});