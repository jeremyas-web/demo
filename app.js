let productos = JSON.parse(localStorage.getItem("productos")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

// ================= GUARDAR =================
function guardar() {
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("historial", JSON.stringify(historial));
  mostrarInventario();
  mostrarHistorial();
}

// ================= UTILIDADES =================
function limpiarInputs(ids) {
  ids.forEach(id => document.getElementById(id).value = "");
}

function esNumeroValido(valor) {
  return !isNaN(valor) && valor !== null && valor !== "";
}

// ================= REGISTRAR =================
function registrarProducto() {
  let codigo = document.getElementById("codigo").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let stock = parseFloat(document.getElementById("stock").value);
  let costo = parseFloat(document.getElementById("costo").value);

  if (!codigo || !nombre || !esNumeroValido(stock) || !esNumeroValido(costo)) {
    alert("Completa todos los campos correctamente");
    return;
  }

  if (stock < 0 || costo < 0) {
    alert("Stock y costo no pueden ser negativos");
    return;
  }

  if (productos.find(p => p.codigo === codigo)) {
    alert("El código ya existe");
    return;
  }

  let total = parseFloat((stock * costo).toFixed(2));

  productos.push({
    codigo,
    nombre,
    stock,
    costoPromedio: parseFloat(costo.toFixed(2)),
    total
  });

  alert("Producto registrado correctamente");
  limpiarInputs(["codigo", "nombre", "stock", "costo"]);
  guardar();
}

// ================= RECEPCIÓN =================
function recepcion() {
  let codigo = document.getElementById("codigoRecepcion").value.trim();
  let cantidad = parseFloat(document.getElementById("cantidadRecepcion").value);
  let costoNuevo = parseFloat(document.getElementById("costoRecepcion").value);

  let producto = productos.find(p => p.codigo === codigo);

  if (!codigo || !esNumeroValido(cantidad) || !esNumeroValido(costoNuevo)) {
    alert("Completa todos los campos correctamente");
    return;
  }

  if (!producto) {
    alert("El producto no existe");
    return;
  }

  if (cantidad <= 0 || costoNuevo <= 0) {
    alert("Cantidad y costo deben ser mayores a 0");
    return;
  }

  let costoAnterior = producto.total;
  let costoCompra = cantidad * costoNuevo;

  let nuevoStock = producto.stock + cantidad;
  let nuevoTotal = costoAnterior + costoCompra;
  let nuevoPromedio = nuevoTotal / nuevoStock;

  producto.stock = nuevoStock;
  producto.total = parseFloat(nuevoTotal.toFixed(2));
  producto.costoPromedio = parseFloat(nuevoPromedio.toFixed(2));

  historial.push({
    tipo: "Recepción",
    codigo,
    nombre: producto.nombre,
    cantidad,
    costo: parseFloat(costoNuevo.toFixed(2)),
    fecha: new Date().toLocaleString(),
    stock: nuevoStock,
    promedio: producto.costoPromedio
  });

  alert("Recepción registrada correctamente");
  limpiarInputs(["codigoRecepcion", "cantidadRecepcion", "costoRecepcion"]);
  guardar();
}

// ================= DESPACHO =================
function despacho() {
  let codigo = document.getElementById("codigoDespacho").value.trim();
  let cantidad = parseFloat(document.getElementById("cantidadDespacho").value);

  let producto = productos.find(p => p.codigo === codigo);

  if (!codigo || !esNumeroValido(cantidad)) {
    alert("Completa los campos correctamente");
    return;
  }

  if (!producto) {
    alert("El producto no existe");
    return;
  }

  if (cantidad <= 0) {
    alert("La cantidad debe ser mayor a 0");
    return;
  }

  if (cantidad > producto.stock) {
    alert("Stock insuficiente");
    return;
  }

  let nuevoStock = producto.stock - cantidad;
  let nuevoTotal = nuevoStock * producto.costoPromedio;

  producto.stock = nuevoStock;
  producto.total = parseFloat(nuevoTotal.toFixed(2));

  historial.push({
    tipo: "Despacho",
    codigo,
    nombre: producto.nombre,
    cantidad,
    costo: producto.costoPromedio,
    fecha: new Date().toLocaleString(),
    stock: nuevoStock,
    promedio: producto.costoPromedio
  });

  alert("Despacho registrado correctamente");
  limpiarInputs(["codigoDespacho", "cantidadDespacho"]);
  guardar();
}

// ================= INVENTARIO =================
function mostrarInventario() {
  let tbody = document.querySelector("#tablaInventario tbody");
  tbody.innerHTML = "";

  productos.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>${p.stock}</td>
        <td>${p.costoPromedio.toFixed(2)}</td>
        <td>${p.total.toFixed(2)}</td>
      </tr>
    `;
  });
}

// ================= HISTORIAL =================
function mostrarHistorial() {
  let tbody = document.querySelector("#tablaHistorial tbody");
  tbody.innerHTML = "";

  historial.forEach(h => {
    tbody.innerHTML += `
      <tr>
        <td>${h.tipo}</td>
        <td>${h.codigo}</td>
        <td>${h.nombre}</td>
        <td>${h.cantidad}</td>
        <td>${h.costo.toFixed(2)}</td>
        <td>${h.fecha}</td>
        <td>${h.stock}</td>
        <td>${h.promedio.toFixed(2)}</td>
      </tr>
    `;
  });
}

// ================= INICIO =================
mostrarInventario();
mostrarHistorial();