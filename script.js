document.addEventListener('DOMContentLoaded', () => {

    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const comprarBtn = document.getElementById('comprar');

    const WHATSAPP_NUMBER = "5493364398022"; // tu número

    // Recuperar carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para actualizar carrito
    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const precio = parseFloat(item.precio); // convertir a número
            const cantidad = item.cantidad || 1; // si no existe, tomar 1
            const subtotal = precio * cantidad;

            const li = document.createElement('li');
            li.textContent = `${item.nombre} x${cantidad} - $${subtotal}`;
            carritoLista.appendChild(li);

            total += subtotal;
        });

        totalSpan.textContent = total;
        carritoBtn.textContent = `Carrito (${carrito.length})`;

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Agregar producto al carrito
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = btn.closest('.producto');

            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);
            const cantidad = 1; // Siempre 1 por ahora

            const existente = carrito.find(item => item.id === id);

            if (existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push({ id, nombre, precio, cantidad });
            }

            actualizarCarrito();
            alert('Producto agregado al carrito');
        });
    });

    // Abrir y cerrar modal
    carritoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        actualizarCarrito();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Finalizar compra por WhatsApp
    comprarBtn.addEventListener('click', () => {
        if (carrito.length === 0) return alert('El carrito está vacío');

        const nombre = document.getElementById('cliente-nombre').value.trim();
        const nota = document.getElementById('cliente-nota').value.trim();

        if (!nombre) return alert('Por favor ingresá tu nombre');

        let mensaje = `Hola! Quiero hacer el siguiente pedido:\n\nNombre: ${nombre}\n`;
        if (nota) mensaje += `Aclaración: ${nota}\n`;
        mensaje += `\n`;

        let total = 0;

        carrito.forEach(item => {
            const precio = parseFloat(item.precio);
            const cantidad = item.cantidad || 1;
            const subtotal = precio * cantidad;
            mensaje += `• ${item.nombre} x${cantidad} - $${subtotal}\n`;
            total += subtotal;
        });

        mensaje += `\nTotal: $${total}`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    });

    // Inicializar
    actualizarCarrito();
});
