const express = require('express')
const Contenedor = require('./contenedor')
const app = express()

const contenedor = new Contenedor("productos.txt")

contenedor.getFile()

const server = app.listen(3000, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
})

console.log(contenedor.getAll())
server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))

app.get('/', (request, response) => {
    
    let randomIdProduct = contenedor.getRandomId()

    let productList = contenedor.getAll().map(item => (randomIdProduct.id == item.id ? ">>>" : "---") + JSON.stringify(item) +"<br></br>" ).join("")


    response.send(`
        <div style='display:flex; flex-direction:column; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <h1 style='color:blue;'> Los metodos son /productos, /productoRandom y /archivo </h1>
            
            <div style='display:flex; flex-direction:column; justify-content: flex-start; gap: 3rem;'>
                
                <a style='border:1px solid grey; padding:2rem;' href="/">Refrescar</a>
                
                
                <div style='display:flex; flex-direction:row; justify-content: flex-start;  padding:2rem; border:1px solid grey; gap:2rem; '>
                <a style='width:25%;' href="./productos">Productos--->>></a>  
                    ${productList}
                </div>
                
                <div style='display:flex; flex-direction:row; justify-content: flex-start; padding:2rem; border:1px solid grey;gap:2rem;'>
                    <a href="./productoRandom">Producto Random--->>></a>
                    ${JSON.stringify(randomIdProduct)}
                
                </div>
                
            <a style='border:1px solid grey; padding:2rem;' href="./archivo/archivo.txt">Archivo</a>
            </div>
        </div>`
    )
})

app.get('/productos', (request, response) => {
    response.send(`
        <div style='display:flex; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <a href="./productos">Todos los Productos</a>
                ${JSON.stringify(contenedor.getAll())}

        </div>`
    )
})

app.get('/productoRandom', (request, response) => {
    response.send(`
        <div style='display:flex; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <a href="./productoRandom">Producto Random</a>
                ${JSON.stringify(contenedor.getRandomId())}

        </div>`
    )
})


app.get('/archivo', (request, response) => {
    response.sendFile(__dirname + '/productos.txt');
})



