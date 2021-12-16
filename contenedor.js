const Archivo = require('./Archivos')
const R = require('ramda')

class Contenedor{
    constructor(filename, priceList=false, wrieFileOnCreation=false){
        this.file = new Archivo(filename)
        this.lastId = 1;
        this.fileList = []
        
        priceList && ( priceList?.length ? this.generate(priceList):this.generate([priceList]) )
        
        wrieFileOnCreation && this.write()

    }
    sortById = () => this.fileList.sort((a,b) => a.id - b.id)
    getId = () => this.lastId ++ || 1
    
    write = async () => await this.file.save(this.fileList)
    
    save = (object, id = false) => {
        console.log(object)
        let idtoUse = id || this.getId()
        this.fileList.push({id:idtoUse , producto:object})
        console.log(this.fileList)
        return idtoUse
    }

    generate = (listado) => listado.forEach( item => this.save(item) )

    saveAndWrite = async (objetct,id =false) => {
        id ? this.deletById(id) : null
        let idUsed = this.save(objetct, id)
        this.sortById()
        await this.write()
        return this.getById(idUsed)
    }

    getAll = (list) => !list ? this.fileList : {list:this.fileList, showList:(this.fileList.length>0)}

    getById = (id) => this.fileList.find(element => element.id == id) || null
    
    deletById = async (id) => {
        let largo = this.fileList.length
        this.fileList = this.fileList.filter(element => element.id != id)
        await this.saveAndWrite()
        return this.fileList.length - largo == 0
    }

    removeById = async (id) => {
        this.fileList = this.fileList.filter(element => element.id != id)
        await this.write()
        return this.fileList
    }

    deleteAll = () => this.fileList = []

    getFile = async () => {
        try{
            await this.file.readFile()
            this.fileList = this.file.data
            this.lastId = Math.max(...this.listIdsDisponibles()) + 1
        }catch(e){
            console.log(e)
        }
    }
       
    random = () => Math.floor( Math.random() * this.fileList.length )

    listIdsDisponibles = () => this.fileList.map( item => item.id )

    getRandomId = () => this.getById( this.listIdsDisponibles() [ this.random() ] )

}

module.exports = Contenedor


