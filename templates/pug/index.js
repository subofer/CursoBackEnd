let socket = io.connect();


socket.on('welcome_event', function (data) {
  console.log("aca",data);
  socket.emit('response_evet', { hola: 'Respuesta del cliente es esta.' });
});

socket.on('listado_Productos', (data) => {
  
  let datos = JSON.parse(data.info)
  
  let productos = document.getElementById("productos")

  productos.innerHTML = datos.map(
    producto => `
      <tr>
        <th scope='row'>${producto.id}</th>
        <th> ${producto.producto.title}</th>
        <th> ${producto.producto.price}</th>
        <th> ${producto.producto.thumbnail}</th>
      `
  ).join("</tr>")
  
});

function enviar(e){
    e.preventDefault()
    let [inputs, valores] =[ [...e.target.form], {} ]
    inputs.forEach(input => (input.name !="") && (valores[input.name] = input.value) )
    console.log(valores)
  }
