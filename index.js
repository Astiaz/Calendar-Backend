
const express = require('express');
const { dbConnection } = require('./database/config,js');
const cors = require('cors');
require('dotenv').config();

// console.log(process.env);

// Crear el servidor de express

const app = express();

// DB
dbConnection();

// CORS
app.use(cors())

// Directorio Publico

app.use( express.static('public') );

// Lectura y Parseo del body

app.use( express.json() );

// Rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})



// Escuchar peticiones

app.listen( process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});