/* ======================
   SUPABASE
====================== */
const SUPABASE_URL = "https://icrhvmpswlkfaaxjitbp.supabase.co";
const SUPABASE_KEY = "sb_publishable_2oE1XB196YWbuNPAE-39Tg_h0cNO_0a";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ======================
   CARRITO
====================== */
const carritoBtn = document.getElementById("carrito-btn");
const modal = document.getElementById("carrito-modal");
const closeBtn = document.querySelector(".close");
const lista = document.getElementById("carrito-lista");
const totalSpan = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderCarrito() {
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio * item.cantidad}
      <button class="menos">-</button>
      ${item.cantidad}
      <button class="mas">+</button>
      <button class="eliminar">x</button>
    `;
    lista.appendChild(li);

    total += item.precio * item.cantidad;

    li.querySelector(".mas").onclick = () => {
      item.cantidad++;
      renderCarrito();
    };

    li.querySelector(".menos").onclick = () => {
      if (item.cantidad > 1) item.cantidad--;
      renderCarrito();
    };

    li.querySelector(".eliminar").onclick = () => {
      carrito = carrito.filter(p => p.id !== item.id);
      renderCarrito();
    };
  });

  totalSpan.textContent = total;
  carritoBtn.textContent = `Carrito (${carrito.reduce((a, i) => a + i.cantidad, 0)})`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("agregar-carrito")) {
    const p = e.target.closest(".producto");
    const id = p.dataset.id;
    const nombre = p.dataset.nombre;
    const precio = Number(p.dataset.precio);

    const existente = carrito.find(i => i.id === id);
    if (existente) existente.cantidad++;
    else carrito.push({ id, nombre, precio, cantidad: 1 });

    renderCarrito();
  }
});

carritoBtn.onclick = () => {
  modal.style.display = "block";
  renderCarrito();
};

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

/* ======================
   COMPRA + STOCK
====================== */
whatsappBtn.onclick = async () => {

  for (const item of carrito) {
    const htmlProduct = document.querySelector(
      `.producto[data-id="${item.id}"]`
    );

    if (!htmlProduct) continue;

    const supabaseId = htmlProduct.dataset.supabaseId;
    if (!supabaseId) continue;

    const { data, error } = await supabase
      .from("products")
      .select("stock, price")
      .eq("id", supabaseId)
      .single();

    if (error || data.stock < item.cantidad) {
      alert(`Stock insuficiente para ${item.nombre}`);
      return;
    }

    await supabase
      .from("products")
      .update({ stock: data.stock - item.cantidad })
      .eq("id", supabaseId);

    await supabase
      .from("sales")
      .insert({
        product_id: supabaseId,
        quantity: item.cantidad,
        total: item.cantidad * data.price
      });
  }

  let msg = "Hola! Quiero comprar:\n";
  carrito.forEach(i => msg += `- ${i.nombre} x${i.cantidad}\n`);
  msg += `Total: $${totalSpan.textContent}`;

  window.open(
    `https://wa.me/543364398022?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  carrito = [];
  renderCarrito();
};
