document.addEventListener('DOMContentLoaded', () => {
    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const comprarBtn = document.getElementById('comprar');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Actualizar carrito en UI
    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;
        carrito.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nombre} - $${item.precio}`;
            carritoLista.appendChild(li);
            total += parseFloat(item.precio);
        });
        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.length})`;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Agregar al carrito
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = producto.dataset.precio;
            carrito.push({ id, nombre, precio });
            actualizarCarrito();
        });
    });

    // Mostrar modal
    carritoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        actualizarCarrito();
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Comprar (simulado)
    comprarBtn.addEventListener('click', () => {
        alert('Compra simulada. En un ecommerce real, integra pagos aquí.');
        carrito = [];
        actualizarCarrito();
        modal.style.display = 'none';
    });

    // Inicializar
    actualizarCarrito();
});