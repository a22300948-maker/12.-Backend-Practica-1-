import .mysql from "mysql2";
const connection = mysqlcreateCondition({
    host: "localhost",
    user:"root",
    password:"",
    database:"escuela"
});
connection.connect((err)->{
    if(err){
        console.error("Error al conectar", err);
    }else{
        console.log("Coneccioón a la base de datos exitosa");
    }
});
export default;