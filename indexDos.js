const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('./desafios/desafioDos/contenedores/ContenedorMemoria')
const ContenedorArchivo = require('./desafios/desafioDOs/contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorMemoria()
const mensajesApi = new ContenedorArchivo('mensajes.json')

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', await productosApi.listarAll());

    // actualizacion de productos
    socket.on('update', async producto => {
        await productosApi.guardar(producto)
        socket.emit('productos', await productosApi.listarAll());
    })

    // carga inicial de mensajes
    socket.emit('mensajes', await mensajesApi.listarAll());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        socket.emit('mensajes', await mensajesApi.listarAll());
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('desafios/desafioDos/public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))