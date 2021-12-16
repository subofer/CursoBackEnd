console.time("inicio")
console.timeLog("inicio",`\x1b[41m Comienza la carga del servicio \x1b[0m`)

//Templates engine///////////////////////////////////////////////////
let templatesDir = __dirname + '/templates/'
//Pug o Hbs
let use = {
    pug:{engine:"pug", useEngine:false, dir:templatesDir + 'pug', ext:"pug", extname:".pug"},
    hbs:{engine:"express-handlebars", useEngine:true, dir:templatesDir + 'handlebars', ext:"hbs", extname:".hbs"}
}.pug

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
////////////////////////////////////////////////////////////////////

//env
var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


const Contenedor = require('./contenedor')
const contenedor = new Contenedor("productos.txt")

/*
// const router = express.Router()
const { Router } = express
const router = Router()
*/

const body_parser = require('body-parser');




console.timeLog("inicio",` \x1b[93m Importaciones y seteos \x1b[0m`)
console.timeLog("inicio",`Primer lectura de la base`)

app.set('views', use.dir)
app.set('views engine', use.ext)
app.use( express.urlencoded({extended:true}) ) ;


httpServer.listen(server_port, function(){
    console.log("Http Server runing")
})

app.get('/', async (request, response) => {
    await contenedor.getFile()
    return response.render('index' + use.extname, {...contenedor.getAll("template")});
})

io.on("connection", (socket) => {

    io.sockets.emit('recienConectado', contenedor.getAll())
    
    socket.on('new-product', (data) => {
        console.log("data",data) //Aca salvo el producto que ya me esta llegandoooooooooo
        contenedor.saveAndWrite(
            {
                "title"    : data.title,
                "precio"   : data.price,
                "thumbnail" : data.thumbnail
            }
        ).then(res => io.sockets.emit('productos', contenedor.getAll() ) )
    })

    socket.on('eliminar', (id) =>{
        contenedor.removeById(id)
        .then(res => io.sockets.emit('productos', contenedor.getAll()) )
    })
    
})


/*
const server = app.listen(server_port, server_host,async () => {
    console.timeLog("inicio",`\x1b[32m El servidor esta escuchando en el puerto: ${server.address().port} \x1b[0m`)
    await contenedor.getFile()
    
    console.timeLog("inicio",`\x1b[32m La 'base de datos' cargo con exito ${contenedor.getAll().length} registros \x1b[0m`)
    console.timeLog("inicio",`Base : ${JSON.stringify(contenedor.getAll())}`)
    console.timeEnd("inicio", "Cargando y listo")
})

server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))

// App
app.get('/', async (request, response) => {
    await contenedor.getFile()
    return response.render('index' + use.extname, {...contenedor.getAll("template")});
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


// Router
app.use('/api', router)

router.post('/producto',  (request, response) => {
    contenedor.saveAndWrite(
        {
            "title"    : request.body.title,
            "precio"   : request.body.precio,
            "thumbnail" : request.body.thumbnail
        }
    ).then(res => response.redirect("/") )
})

router.put('/producto/:id',  (request, response) => {
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
*/