const TABLA_PRODUCTOS = {
    id: "increments",
    title: "string",
    precio: "integer",
    thumbnail: "string",
}

const MARIA_CONFIG ={
    client:'mysql',
    pool:{min:0,max:7},
    connection:{
        host:'localhost',
        user:'root',
        password:'1234',
        database: 'CoderHouse',
    }
}

class MariaConector{
    constructor(filename, config = MARIA_CONFIG){
        this.knex = require('knex')(config)
        this.table = filename;
    }
    
    readTable = async (filter = '*') => await this.knex(this.table).select(filter) || []
    
    save = async (itemToSave, run = true) => {
        await this.createTable(TABLA_PRODUCTOS)
        .then(() => console.log("Se creo la tabla, porque no existia"))
        .catch(err => err.errno !== 1050 && console.error(err))
        .finally(async () => run && await this.knex(this.table).insert(itemToSave)  )
    }
    

    createTable = async (tableSchema) => {
        await this.knex.schema.createTable(this.table, row => {
            Object.keys(tableSchema).forEach(key => {
                row[tableSchema[key]](key) 
            })
        })
    }
        
    deleteById = async (id) => await this.knex(this.table).where({id: id}).del()

}

module.exports = MariaConector








