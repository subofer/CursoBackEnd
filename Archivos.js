const fs = require('fs').promises

class Archivo{
    constructor(filename){
        this.filename = filename;
        this.data = ""
    }
    str(json){
        return JSON.stringify(json)
    }

    save = async (objetc) =>
        fs.readFile(this.filename, 'utf8')
            .then(console.log)
            .catch(e => this.createFile())
            .finally(() => this.addToFile(this.str(objetc)) )
    
    readFile = async () => 
        fs.readFile(this.filename, 'utf8')
            .then(data => this.data = JSON.parse(data))
            .catch(err => console.log("Fallo la lectura"))

    createFile = async () =>
        fs.writeFile(this.filename, '', 'utf8' )
            .then(() => console.log('Se Creo el archivo'))
            .catch(err => console.log("error de escritura", err))

    addToFile = async (objetc) => 
        fs.appendFile(this.filename, this.str(objetc))
            .then(() => console.log("Se agregao al final del arhivo"))
            .catch((e) => console.log("no se pudo agregar al achivo", e))

}



module.exports = Archivo