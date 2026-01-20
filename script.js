/* =====================
   SUPABASE CONFIG
===================== */
const SUPABASE_URL = "https://icrhvmpswlkfaaxjitbp.supabase.co";
const SUPABASE_KEY = "sb_publishable_2oE1XB196YWbuNPAE-39Tg_h0cNO_0a";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* =====================
   VARIABLES
===================== */
const productosGrid = document.getElementById("productos-grid");
const carritoBtn = document.getElementById("carrito-btn");
const modal = document.getElementById("carrito-modal");
const closeBtn = document.querySelector(".close");
const carritoLista = document.getElementById("carrito-lista");
const totalSpan = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* =====================
   CARGAR PRODUCTOS
===================== */
async function cargarProductos() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .neq("category", "pins") // excluye los pines para otra sección
    .order("name");

  if (error) {
    console.error(error);
    return;
  }

  productosGrid.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button ${p.stock === 0 ? "disabled" : ""} 
        onclick="agregarAlCarrito('${p.id}', '${p.name}', ${p.price}, ${p.stock})">
        ${p.stock === 0 ? "Sin stock" : "Agregar"}
      </button>
      <small>Stock: ${p.stock}</small>
    `;

    productosGrid.appendChild(div);
  });
}

/* =====================
   CARGAR PINES PARA CROCS
===================== */
async function cargarPines() {
  const pinesGrid = document.getElementById("pines-grid");
  if (!pinesGrid) return;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category", "pins")
    .order("name");

  if (error) {
    console.error(error);
    return;
  }

  pinesGrid.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button ${p.stock === 0 ? "disabled" : ""} 
        onclick="agregarAlCarrito('${p.id}', '${p.name}', ${p.price}, ${p.stock})">
        ${p.stock === 0 ? "Sin stock" : "Agregar"}
      </button>
      <small>Stock: ${p.stock}</small>
    `;

    pinesGrid.appendChild(div);
  });
}

/* =====================
   CARRITO
===================== */
function agregarAlCarrito(id, nombre, precio, stock) {
  const item = carrito.find(i => i.id === id);

  if (item) {
    if (item.cantidad < stock) {
      item.cantidad++;
    } else {
      alert("No hay más stock disponible");
      return;
    }
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoLista.innerHTML = "";
  let total = 0;

  carrito.forEach(i => {
    total += i.precio * i.cantidad;

    const li = document.createElement("li");
    li.innerHTML = `
      ${i.nombre} x${i.cantidad}
      <button onclick="cambiarCantidad('${i.id}', -1)">-</button>
      <button onclick="cambiarCantidad('${i.id}', 1)">+</button>
      <button onclick="eliminarItem('${i.id}')">x</button>
    `;
    carritoLista.appendChild(li);
  });

  totalSpan.textContent = total;
  carritoBtn.textContent = `Carrito (${carrito.reduce((a, i) => a + i.cantidad, 0)})`;
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(i => i.id === id);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.id !== id);
  }

  guardarCarrito();
  actualizarCarrito();
}

function eliminarItem(id) {
  carrito = carrito.filter(i => i.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* =====================
   MODAL
===================== */
carritoBtn.onclick = () => {
  modal.style.display = "block";
  actualizarCarrito();
};
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

/* =====================
   WHATSAPP
===================== */
whatsappBtn.onclick = () => {
  if (carrito.length === 0) return alert("Carrito vacío");

  let msg = "Hola! Quiero comprar:\n";
  carrito.forEach(i => msg += `- ${i.nombre} x${i.cantidad}\n`);
  msg += `Total: $${totalSpan.textContent}`;

  window.open(
    `https://wa.me/543364398022?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

/* =====================
   INIT
===================== */
cargarProductos();
cargarPines();
actualizarCarrito();
