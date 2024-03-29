const fs = require('fs').promises

class ChatService{
    constructor(filename){
        this.filename = filename;
        this.data = []
        this.readFile()
    }
    
    addMsg = async (msg) => {
      this.data.push(msg)
      await this.save(this.data)
      return this.data
    }

    getChat = () => this.data;

    str(json){
        return JSON.stringify(json)
    }

    save = async (objetc) =>
        await fs.readFile(this.filename, 'utf8')
            .then(console.log)
            .catch(e => this.createFile())
            .finally(() => this.createFile(this.str(objetc)) )
    
    readFile = async () => 
        await fs.readFile(this.filename, 'utf8')
            .then(data => this.data = JSON.parse(data))
            .catch(err => console.log("Fallo la lectura"))

    createFile = async (prod) =>
        fs.writeFile(this.filename, prod, 'utf8' )
            .then(() => console.log('Se Creo el archivo'))
            .catch(err => console.log("error de escritura", err))

    addToFile = async (objetc) => 
        fs.appendFile(this.filename, this.str(objetc))
            .then(() => console.log("Se agregao al final del arhivo"))
            .catch((e) => console.log("no se pudo agregar al achivo", e))

}

module.exports = ChatService