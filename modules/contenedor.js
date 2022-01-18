const dataBase = require('./MariaConector')

class Contenedor{
    constructor(dbTable, priceList=false){
        this.mariaDB = new dataBase(dbTable);
        this.productList = []
    }
    
    generateFromJson = (Json) => Json.forEach( item => this.save(item) )

    sortById = () => this.productList.sort((a,b) => a.id - b.id)
    
    save = async (object) => await this.mariaDB.save(object)

    getAll = async () =>{
       await this.mariaDB.save(false, false)
       this.productList = await this.mariaDB.readTable()
       
       return this.productList
    }

    getById = (id) => this.getAll.find(element => element.id == id) || null
    
    deletById = async (id) => {
        let largo = this.productList.length
        this.productList = this.productList.filter(element => element.id != id)
        await this.saveAndWrite()
        return this.productList.length - largo == 0
    }

    removeById = async (id) => {
        await this.mariaDB.deleteById(id)
        this.productList = await this.getAll()
        return this.productList
    }
    
    getById = async (id) => await this.mariaDB.readTable({id: id})
    

}

module.exports = Contenedor


