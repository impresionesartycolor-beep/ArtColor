document.addEventListener('DOMContentLoaded', () => {
    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const whatsappBtn = document.getElementById('whatsapp');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Actualiza carrito en UI
    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;
        carrito.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
            carritoLista.appendChild(li);
            total += item.precio * item.cantidad;
        });
        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.reduce((sum, item) => sum + item.cantidad, 0)})`;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Agregar producto al carrito
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);

            // Verificar si ya existe en el carrito
            const existing = carrito.find(item => item.id === id);
            if (existing) {
                existing.cantidad += 1;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }

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

    // Cerrar modal al hacer click fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Finalizar por WhatsApp
    whatsappBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const numero = "+543364398022"; // tu número
        let mensaje = "¡Hola! Quiero realizar la siguiente compra:%0A";
        carrito.forEach(item => {
            mensaje += `- ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}%0A`;
        });
        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        mensaje += `Total: $${total.toFixed(2)}`;

        const url = `https://api.whatsapp.com/send?phone=${numero}&text=${mensaje}`;
        window.open(url, '_blank');

        // Vaciar carrito después de enviar
        carrito = [];
        actualizarCarrito();
        modal.style.display = 'none';
    });

    // Inicializar carrito al cargar la página
    actualizarCarrito();
});
