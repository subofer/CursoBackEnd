const dataBase = require('./MariaConector')

class Contenedor{
    constructor(dbTable, priceList=false){
        this.mariaDB = new dataBase(dbTable)
        this.lastId = 1;
        this.productList = []
    }

    sortById = () => this.productList.sort((a,b) => a.id - b.id)
    
    getId = () => {
        let lastId = this.lastId ++
        return isNaN(lastId) ? 1 : lastId
    }
    
    write = async () => await this.mariaDB.save(this.productList)
    
    save = async (object, id = false) => {
        let idtoUse = id || this.getId()
        await this.mariaDB.save({id:idtoUse , ...object})
        this.productList = await this.mariaDB.readFile()

        console.log("aca",this.productList)
        return idtoUse
    }

    generate = (listado) => listado.forEach( item => this.save(item) )

    saveAndWrite = async (objetct,id = false) => {
        id ? this.deletById(id) : null
        let idUsed = this.save(objetct, id)
        this.sortById()
        await this.write()
        return this.getById(idUsed)
    }

    getAll = (list) => !list ? this.productList : {list:this.productList, showList:(this.productList.length>0)}

    getById = (id) => this.productList.find(element => element.id == id) || null
    
    deletById = async (id) => {
        let largo = this.productList.length
        this.productList = this.productList.filter(element => element.id != id)
        await this.saveAndWrite()
        return this.productList.length - largo == 0
    }

    removeById = async (id) => {
        this.productList = this.productList.filter(element => element.id != id)
        await this.write()
        return this.productList
    }

    deleteAll = () => this.productList = []

    getFile = async () => {
        try{
            await this.mariaDB.readFile()
            this.productList = this.mariaDB.data
            this.lastId = Math.max(...this.listIdsDisponibles()) + 1
        }catch(e){
            console.log(e)
        }
    }
       
    random = () => Math.floor( Math.random() * this.productList.length )

    listIdsDisponibles = () => this.productList.map( item => item.id ) || []

    getRandomId = () => this.getById( this.listIdsDisponibles() [ this.random() ] )

}

module.exports = Contenedor


