class Tienta{
    constructor(){
        this.productosEnStock = []
    }
    agregarListadoAlStock(listado){

        listado.forEach(item =>  this.productosEnStock.push(new Producto(item)))
    }

    renderTienda(destino){
        document.getElementById(destino).innerHTML = this.productosEnStock.map(juego => juego.mostrarCard()).join("")
    }
}

class Producto{

    constructor({id, name, price, category, img}){
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.img = img;
    }

    mostrarCard(){
        return `
         <div class="container__box" category="acción">
         
            <img class="videogames" src=${this.img} alt="">

            <button id=${this.name} class="elemento" onclick="listaDeDeseados(${this.id})"><i class='bx bx-plus-circle'></i></button>
        
         </div>
       `
    }

}



let juegos= [
    {id:1,name:"god of war", price:1, category:"adventure", img:"imagenes/dbz.jpg"},
    {id:2,name:"fifa", price:1, category:"sports", img:"imagenes/dbz.jpg"},
    {id:3,name:"mario cart", price:1, category:"play", img:"imagenes/dbz.jpg"}
]

let tienda = new Tienda()

tienda.agregarListadoAlStock(juegos)

tienda.renderTienda("acaVanLosJuegos")








let juegos= [
    {id:1,name:"gsdsdff war", price:1, category:"adventure", img:"imagenes/dbz.jpg"},
    {id:2,name:"fidsfgsfa", price:1, category:"sports", img:"imagenes/dbz.jpg"},
    {id:3,name:"marsdfgsdfio cart", price:1, category:"play", img:"imagenes/dbz.jpg"}
]

let tienda = new Tienda()

tienda.agregarListadoAlStock(juegos)

tienda.renderTienda("allaVanLosJuegos")



const listaDeDeseados = (id) => {

    let elDeseado = tienda.find(item => item.id === id)


}