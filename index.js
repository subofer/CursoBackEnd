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
        <div style='display:flex; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <h1 style='color:blue;'> Los metodos son /productos, /productoRandom y /archivo </h1>
            
            <a href="./productos">Productos</a>
            <a href="./productoRandom">Producto Random</a>
            <a href="./archivo">Archivo</a>

        </div>`
    )
})

app.get('/productos', (request, response) => {
    response.send(`
        <div style='display:flex; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <a href="./productoRandom">Todos los Productos</a>
                ${contenedor.getAll()}

        </div>`
    )
})

app.get('/productoRandom', (request, response) => {
    response.send(`
        <div style='display:flex; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <a href="./productoRandom">Producto Random</a>
                ${contenedor.getRandomId()}

        </div>`
    )
})


app.get('/archivo', (request, response) => {
    response.sendFile(__dirname + '/productos.txt');
})



