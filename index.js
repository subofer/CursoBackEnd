const cluster = require(`cluster`)
const numCPUs = require(`os`).cpus().length *2

console.log('tienes ', numCPUs, 'nucleos')

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

const Contenedor = require('./modules/contenedor')
const contenedor = new Contenedor("productos")

const { Router } = express
const router = Router()


const body_parser = require('body-parser');

console.timeLog("inicio",` \x1b[93m Importaciones y seteos \x1b[0m`)
console.timeLog("inicio",`Primer lectura de la base`)

app.set('views', use.dir)
app.set('views engine', use.ext)
app.use( express.urlencoded({extended:true}) ) ;

const ChatService = require('./modules/ChatService')
const serverChat = new ChatService('./dbs/chats.txt')


app.get('/', async (request, response) => {
    return response.render('index' + use.extname, await {...contenedor.getAll("template")});
})

httpServer.listen(server_port, function(){
    console.log("Http Server runing")
})

io.on("connection", async (socket) => {

    io.sockets.emit('recienConectado', await contenedor.getAll())

    io.sockets.emit('chat', serverChat.getChat())

    
    socket.on('new-product', (data) => {
        console.log("data",data) //Aca salvo el producto que ya me esta llegandoooooooooo
        contenedor.save(
            {
                "title"    : data.title,
                "precio"   : data.price,
                "thumbnail" : data.thumbnail
            }
        ).then(async res => io.sockets.emit('productos', await contenedor.getAll()) )
    })

    socket.on('eliminar', (id) =>{
        contenedor.removeById(id)
        .then(async res => io.sockets.emit('productos', await contenedor.getAll()) )
    })

    socket.on('chatMessage', async (msg) =>{
        let mensajes = await serverChat.addMsg(msg)
        io.sockets.emit('chat', mensajes)
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

*/
// Router
app.use('/api', router)

router.post('/productos', async (request, response) => {
    await contenedor.getFile()
    return response.render('index' + use.extname, {...contenedor.getAll("template")});
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
