const Archivo = require('./Archivos')

class Contenedor{
    constructor(filename, priceList=false, wrieFileOnCreation=false){
        this.file = new Archivo(filename)
        this.lastId = 1;
        this.fileList = []
        
        priceList && ( priceList?.length ? this.generate(priceList):this.generate([priceList]) )
        
        wrieFileOnCreation && this.write()

    }

    getId = () => this.lastId ++
    
    write = () => this.file.save(this.fileList)
    
    save = (object) => this.fileList.push({id:this.getId() , producto:object})

    generate = (listado) => listado.forEach( item => this.save(item) )

    saveAndWrite = (objetct) => this.save(objetct) && this.write()

    getAll = () => this.fileList
    
    getById = (id) => this.fileList.find(element => element.id == id) || null
    
    deletById = (id) => this.fileList = this.fileList.filter(element => element.id != id)

    deleteAll = () => this.fileList = []

    getFile = async () => {
        try{
            await this.file.readFile()
            this.fileList = JSON.parse(this.file.data)
        }catch(e){
            console.log(e)
        }
    }
       
    random = () => Math.floor( Math.random() * this.fileList.length )

    listIdsDisponibles = () => this.fileList.map( item => item.id )

    getRandomId = () => this.getById( this.listIdsDisponibles() [ this.random() ] )

}

module.exports = Contenedor
