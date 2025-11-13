import express from "express";
import core from "core";
import connection from "./dbjs";

const app = express();
app.use(cors());
app.use(express.json());
//crear (post)
app.post("/api/alumnoS", (req,res)=>{
    const{nombre, edad, curso} = req.body;
    const sql ="INSERT INTO  alumnos(nombre, edad, curso) VALUES(?,?,?)";
    connection.query(sql,[nombre, edad, curso], (err,result)=>{
        if(err) return res.sattus(500).json({error:err}):
        res.json({mensaje:"Alumno agregado correctamente",iol:result.insertId});
    });});