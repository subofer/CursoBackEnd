const express = require('express')
const Contenedor = require('./contenedor')
const app = express()

const contenedor = new Contenedor("productos.txt")

contenedor.getFile()


contenedor.getFile().then( () =>{
    
    const server = app.listen(process.env.PORT || 5000, () => {
        console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
        console.log(`La 'base de datos' cargo con exito ${contenedor.getAll().length} registros`)
    })
    
    server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))
    
    app.get('/', (request, response) => {
        
        let rProduct = contenedor.getRandomId()
        let pshow = JSON.stringify(rProduct)
    
        
        
        let productList = contenedor
        .getAll()
        .map(   
            item => 
              {   
                let selected = rProduct.id == item.id
                let style = selected? "border:1px solid red " : ""
                return`
                    <div style="${style};padding:15px;" >
                        ${(selected ? ">>>" : "---")} ${JSON.stringify(item)} 
                    </div>
                `
        })
        .join( "<br/>" )
   


    response.send(`
        <div style='display:flex; flex-direction:column; justify-content: flex-start; gap:1rem; font-Family: "Poxima nova", text-decoration:none';>
            <h1 style='color:blue;'> Los metodos son /productos, /productoRandom y /archivo </h1>
            
            <div style='display:flex; flex-direction:column; justify-content: flex-start; gap: 3rem;'>
                
                <a style='border:1px solid grey; padding:2rem;' href="/">Random</a>
                
                
                <div style='display:flex; flex-direction:row; justify-content: flex-start;  padding:2rem; border:1px solid grey; gap:2rem; '>
                    
                    <p style='width:25%;'>Productos--->>></p>
                    
                    <div style='display:flex; flex-direction:column; padding:15px;'>
                        <p> ${productList} </p>    
                    </div>
                
                </div>
                
                <div style='display:flex; flex-direction:row; justify-content: flex-start; padding:2rem; border:1px solid grey;gap:2rem;'>
                    
                    <p style='width:25%;'>Producto Random--->>></p>
                
                    <div style='display:flex; flex-direction:column; padding:15px;'>
                            <p> ${pshow} </p>    
                    </div>
              
                </div>
                
            <a style='border:1px solid grey; padding:2rem;' href="./archivo/productos.txt">Descargar Archivo</a>
            </div>
        </div>`
    )
})

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


app.get('/archivo/:fileName', (request, response) => {
    response.sendFile(__dirname +'/' + request.params.fileName);
})



