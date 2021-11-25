const express = require('express')
const Contenedor = require('./contenedor')
const app = express()

const contenedor = new Contenedor("productos.txt")

contenedor.getFile()

const server = app.listen(process.env.PORT  || 3000, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
})


server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))

app.get('/', (request, response) => {
    response.send(`
        <h1 style='color:blue;'>
                Los metodos son /productos, /productoRandom y /archivo
                <a href="./productos">Productos</a>
                <a href="./productoRandom">Producto Random</a>
                <a href="./archivo">Archivo</a>
        </h1>`
    )
})

app.get('/productos', (request, response) => {
    response.send(contenedor.getAll())
})

app.get('/productoRandom', (request, response) => {
    response.send(contenedor.getRandomId())
})


app.get('/archivo', (request, response) => {
    response.sendFile(__dirname + '/productos.txt');
})



