const express = require('express')
const app = express()

const cors = require('cors')

const http = require('http')
const server = http.createServer(app)

const mysql = require('mysql');
const bodyParser = require('body-parser');

//Middlewares ---
app.use(cors())
app.use(express.json());
app.use(bodyParser.json()); 
app.use(express.urlencoded({extended: true}));
//Middlewares ---

//Socket --------
const {Server} = require('socket.io')
const io = new Server(server,{cors:{origin:'*'}})

io.on('connection',(socket)=>{
    console.log("User conectado:", socket.id);
    socket.on('disconnect',()=>{
        console.log("Un usuario se ha deconectado");
    })
    socket.on('chat',(msg)=>{
        io.emit('chat',msg)
    })
})
//Socket --------

//MYSQL ---------
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'chatsocket',
    driver: 'com.mysql.cj.jdbc.Driver'
  });

  connection.connect((err) => {
    if(err){
      console.error('Error al conectar a la base de datos:', err);
      return;
    }   console.log('Conexión exitosa a la base de datos');
  });
//MYSQL ---------


//API -----------
// GET
app.get('/api/usuario',(req,res)=>{
    const query = 'SELECT * FROM usuario';
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
      }
      res.send(rows);
    });
})
app.get('/api/sala',(req,res)=>{
    const query = 'SELECT * FROM sala';
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener las salas' });
      }
      res.send(rows);
    });
})

app.get('/api/usuariosala',(req,res)=>{
    const query = 'SELECT usuariossala.usuario_idusuario, ' +
  'CONCAT(\'{"idusuario":\', usuario.idusuario, \',"nombre":"\', usuario.nombre, \'","correo":"\', usuario.correo, \'","password":"\', usuario.password, \'"}\') AS usuario_info, ' +
  'usuariossala.sala_idsala ' +
  'FROM usuariossala ' +
  'JOIN usuario ON usuariossala.usuario_idusuario = usuario.idusuario';
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener usuariossala' });
      }
      const usersWithDetails = rows.map((userSala) => {
        return {
          usuario_idusuario: JSON.parse(userSala.usuario_info), // Convertimos el string JSON en un objeto
          sala_idsala: userSala.sala_idsala
        };
      });
      res.send(usersWithDetails);
    });
})
app.get('/api/usuarioensala/:id1/:id2',(req,res)=>{
    const id1 = req.params.id1
    const id2 = req.params.id2

    const query = 'SELECT sala_idsala FROM usuariossala '+
    ' WHERE usuario_idusuario ='+id1+
    ' AND sala_idsala IN (SELECT sala_idsala FROM usuariossala WHERE usuario_idusuario ='+id2+')'
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios en sala' });
      }
      res.send(rows[0]);
    });
})
app.get('/api/mensaje',(req,res)=>{
    const query = 'SELECT * FROM mensaje';
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener mensaje' });
      }
      res.send(rows);
    });
})
/* 
app.get('/api/mensaje/:sala',(req,res)=>{
    let sala = req.params.sala
    const query = 'SELECT * FROM mensaje where sala_idsala ='+ sala;
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener mensaje' });
      }
      res.send(rows);
    });
}) */
app.get('/api/mensaje/:idsala', (req, res) => {
    
    const query = 'SELECT mensaje.idmensaje, mensaje.mensaje, ' +
    'CONCAT(\'{"idusuario":\', usuario.idusuario, \',"nombre":"\', usuario.nombre, \'","correo":"\', usuario.correo, \'"}\') AS usuario_idusuario, ' +
    'mensaje.sala_idsala ' +
    'FROM mensaje ' +
    'JOIN usuario ON mensaje.usuario_idusuario = usuario.idusuario where mensaje.sala_idsala =' +req.params.idsala;
    
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener los artículos' });
      }
      const messagesWithUserDetails = rows.map((message) => {
        return {
          idmensaje: message.idmensaje,
          mensaje: message.mensaje,
          usuario_idusuario: JSON.parse(message.usuario_idusuario), // Convertimos el string JSON en un objeto
          sala_idsala: message.sala_idsala
        };
      });
      res.send(messagesWithUserDetails)
    });
  });
//POST
app.post('/api/usuario/new', (req, res) => {
    const { idusuario,nombre,correo,password } = req.body;
    const query = 'INSERT INTO usuario (idusuario,nombre,correo,password) VALUES (?,?,?,?)';
    const values = [idusuario,nombre,correo,password];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al crear un usuario' });
      }
  
      res.json({ message: 'Usuario creado exitosamente' });
    });
});
app.post('/api/sala/new', (req, res) => {
    const { idsala } = req.body;
    const query = 'INSERT INTO sala (idsala) VALUES (?)';
    const values = [idsala];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al crear una sala' });
      }
      res.json({ message: 'Sala creada exitosamente', result });
    });
});
app.post('/api/usuariosala/new', (req, res) => {
    const { usuario_idusuario, sala_idsala } = req.body;
    const query = 'INSERT INTO usuariossala (usuario_idusuario, sala_idsala) VALUES (?,?)';
    const values = [usuario_idusuario, sala_idsala];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al crear un usuariosala' });
      }
  
      res.json({ message: 'Usuariosala creado exitosamente' });
    });
});
app.post('/api/mensaje/new', (req, res) => {
    const { mensaje,usuario_idusuario, sala_idsala } = req.body;
    const query = 'INSERT INTO mensaje (mensaje,usuario_idusuario,sala_idsala) VALUES (?,?,?)';
    const values = [mensaje,usuario_idusuario,sala_idsala];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al crear un mensaje' });
      }
  
      res.json({ message: 'mensaje creado exitosamente' });
    });
});
//DELETE
app.delete('/api/usuario/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'delete from usuario where idusuario ='+id;
    const values = [id];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return res.status(500).json({ error: 'Error al eliminar usuario' });
      }
      res.json({ message: 'Usuario eliminado exitosamente' });
    });
  });
//API -----------

server.listen(3000,()=>{
    console.log("Escuchando en puerto 3000");
})
/* 
{
    "idusuario":0,
    "nombre":"tomas",
    "correo":"tomas@gmail.com",
    "password":"123123"
}
{
    "idsala":0
}
{
    "usuario_idusuario":4,
    "sala_idsala":3
}
*/