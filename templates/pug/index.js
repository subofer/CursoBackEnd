let socket = io();

socket.on('recienConectado', (data) => {
  console.log("recien conectado", data);
  renderTable(data);
});

socket.on('productos', (data) => {
  renderTable(data);
});

socket.on('chat', (data) => {
  renderChat(data);
});


const enviar = (e) => {
  let [inputs, valores] =[ [...e.target], {} ];
  e.preventDefault();
  inputs.forEach(input => (input.name !="") && (valores[input.name] = input.value) );
  socket.emit('new-product', valores);
};

const sendChatMessage = (e) => {
e.preventDefault();
  let mensaje = {
    time: Date.now(),
    user: document.getElementById("userName").value,
    mensaje: document.getElementById("chatInput").value,
  }  
  socket.emit('chatMessage',mensaje);
  document.getElementById("chatInput").value = ""
};

const eliminar = (id) => {
  socket.emit('eliminar', id);
};

const renderTable = (data) => {
  let productos = document.getElementById("productos")
  productos.innerHTML = data.map(
    producto => 
      `<tr>
          <th scope='row'>${producto.id}</th>
          <td> ${producto.title}</td>
          <td> ${producto.precio}</td>
          <td> ${producto.thumbnail}</td>
          <td> <button onclick='eliminar(${producto.id})'>x</button></td>
      </tr>`
    ).join("")
}

const formatFecha = (mensaje) => {
  let fecha = new Date(mensaje)

  let salida = {
    year: fecha.getFullYear(),
    mes: fecha.getMonth()+1,
    dia: fecha.getDate(),
    hora: fecha.toISOString().substring(12, 19).replace("T", " ")
  }
  
  return `${salida.year}/${salida.mes}/${salida.dia} - ${salida.hora}`
}

const renderChat = (data) => {
  console.log(data)
  let chatTable = document.getElementById("chatWindows")
  chatTable.innerHTML = data.map(
    mensaje => 
      `<tr>
        <td>${formatFecha(mensaje.time)}</td>
        <td>${mensaje.user}</td>
        <td>${mensaje.mensaje}</td>
      </tr>`
    ).join("")
}