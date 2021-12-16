let socket = io();

socket.on('recienConectado', (data) => {
  console.log("recien conectado", data)
  renderTable(data)
})

socket.on('productos', (data) => {
  renderTable(data)
});

const enviar = (e) => {
  let [inputs, valores] =[ [...e.target], {} ]
  e.preventDefault()
  inputs.forEach(input => (input.name !="") && (valores[input.name] = input.value) )
  socket.emit('new-product', valores)
}

const eliminar = (id) => {
  socket.emit('eliminar', id)
}


const renderTable = (data) => {
  let productos = document.getElementById("productos")
  productos.innerHTML = data.map(
    producto => 
      `<tr>
          <th scope='row'>${producto.id}</th>
          <td> ${producto.producto.title}</td>
          <td> ${producto.producto.precio}</td>
          <td> ${producto.producto.thumbnail}</td>
          <td> <button onclick='eliminar(${producto.id})'>x</button></td>
      </tr>`
    ).join("")
}