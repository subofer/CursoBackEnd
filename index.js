console.time("inicio")
console.timeLog("inicio",`\x1b[41m Comienza la carga del servicio \x1b[0m`)

const express = require('express')
const Contenedor = require('./contenedor')

const app = express()

let templatesDir = __dirname + '/templates/'
//Pug o Hbs
let use = {
    pug:{engine:"pug", useEngine:false, dir:templatesDir + 'pug', ext:"pug", extname:".pug"},
    hbs:{engine:"express-handlebars", useEngine:true, dir:templatesDir + 'handlebars', ext:"hbs", extname:".hbs"}
}.hbs




if(use.useEngine){
    const templateEngine = require(use.engine);
    
    app.engine(
        "hbs",
        templateEngine.engine({
            extname: use.extname,
            partialsDir: __dirname + use.dir
        })
    )
}

app.set('views', use.dir)
app.set('views engine', use.ext)







const { Router } = express
const body_parser = require('body-parser');

const router = Router()
const contenedor = new Contenedor("productos.txt")


var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

console.timeLog("inicio",` \x1b[93m Importaciones y seteos \x1b[0m`)


console.timeLog("inicio",`Primer lectura de la base`)

app.use( express.urlencoded({extended:true}) ) ;

    const server = app.listen(server_port, server_host,async () => {
        
        console.timeLog("inicio",`\x1b[32m El servidor esta escuchando en el puerto: ${server.address().port} \x1b[0m`)
        await contenedor.getFile()

        

        console.timeLog("inicio",`\x1b[32m La 'base de datos' cargo con exito ${contenedor.getAll().length} registros \x1b[0m`)
        console.timeLog("inicio",`Base : ${JSON.stringify(contenedor.getAll())}`)
        
        console.timeEnd("inicio", "Cargando y listo")
    })
    
    server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))
    
    app.get('/', async (request, response) => {
        await contenedor.getFile()
        return response.render('index' + use.extname, contenedor.getAll());
    })


    router.get('/productos', async (request, response) => {
        await contenedor.getFile()
        response.send('Todos los productos : ' + JSON.stringify(contenedor.getAll()))
    })
    
    router.get('/productos/:id', (request, response) => {
        response.sendFile(
            'Producto pedido : ' + JSON.stringify(contenedor.getById(request.params.id) || {id:0, product:{title:"El articulo no existe", thumbnail:"Sin objeto"}}))
    })

    router.get('/getproducto', (request, response) => {
        response.sendFile(__dirname + "/formulario.html")
    })

    router.post('/producto',  (request, response) => {
        contenedor.saveAndWrite(
            {
                "title"    : request.body.title,
                "precio"   : request.body.precio,
                "thumbnail" : request.body.thumbnail
            }
        ).then(res => response.redirect("/") )
       
    })

    router.post('/producto/:id',  (request, response) => {
        contenedor.saveAndWrite(
            {
                "title":request.body.title,
                "precio":request.body.precio,
                "thumbnail":request.body.thumbnail
            }
            ,parseInt(request.params.id) || false
        
        ).then(res => response.send(res) )
    })

    router.put('/producto/put',  (request, response) => {
        
        console.log("ACA",request.params.id)
        
        contenedor.saveAndWrite(
            {
                "title":request.body.title,
                "precio":request.body.precio,
                "thumbnail":request.body.thumbnail
            }
            ,parseInt(request.params.id) || false
        
        ).then(res => response.send(res) )
    })
    
    router.delete('/producto/:id',  (request, response) => {
        contenedor.deletById(request.params.id)
        .then(resp => response.send(resp ? "Se Elimino :" + request.params.id: "no se elimino"))
    })

    app.use('/api', router)


    app.get('/weird', (request, response) => {
        
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
                <form action="/api/producto" method="POST" style='display:flex; flex-direction:column; justify-content: center;  padding:2rem; border:1px solid grey; gap:2rem; '>
                
                    <h2>Agregue un nuevo productor</h2>
                        <div style='display:flex; flex-direction:row;'>
                            <h3>Nombre</h3>
                            <input type="text" name="title" /><br/>
                        </div>
                        <div style='display:flex; flex-direction:row;'>
                            <h3>Precio</h3>
                            <input type="text" name="precio"/><br/>
                        </div>
                        <div style='display:flex; flex-direction:row;'>
                            <h3>Foto</h3>
                            <input type="text" name="thumbnail"/><br/>
                        </div>
                        <div style='display:flex; flex-direction:row;'>
                            <input type="submit" value="Guardar Producto"/>
                    </div>
                
                </form>

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



app.get('/productos', (request, response) => {
    return response.render('productos' + use.extname, {...contenedor.getAll("template")});
})

app.get('/productoRandom', (request, response) => {
    return response.render('productos' + use.extname, { list:contenedor.getRandomId(), showList:true});
})


app.get('/archivo/:fileName', (request, response) => {
    response.sendFile(__dirname +'/' + request.params.fileName);
})
