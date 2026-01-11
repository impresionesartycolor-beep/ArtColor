document.addEventListener('DOMContentLoaded', () => {
    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const whatsappBtn = document.getElementById('whatsapp');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Actualizar carrito y cantidades
    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.nombre}</strong> - $${(item.precio * item.cantidad).toFixed(2)}
                <div class="cantidad-controls">
                    <button class="menos">-</button>
                    <span>${item.cantidad}</span>
                    <button class="mas">+</button>
                    <button class="eliminar">x</button>
                </div>
            `;
            carritoLista.appendChild(li);
            total += item.precio * item.cantidad;

            li.querySelector('.mas').addEventListener('click', () => {
                item.cantidad += 1;
                actualizarCarrito();
            });

            li.querySelector('.menos').addEventListener('click', () => {
                if (item.cantidad > 1) {
                    item.cantidad -= 1;
                    actualizarCarrito();
                }
            });

            li.querySelector('.eliminar').addEventListener('click', () => {
                carrito = carrito.filter(i => i.id !== item.id);
                actualizarCarrito();
            });
        });

        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.reduce((acc, i) => acc + i.cantidad, 0)})`;

        // Actualiza contador visual de cada producto
        document.querySelectorAll('.producto').forEach(prod => {
            const id = prod.dataset.id;
            const item = carrito.find(i => i.id === id);
            prod.querySelector('.cantidad-agregada').textContent = item ? item.cantidad : 0;
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Mostrar notificación sobre el producto
    function mostrarNotificacionSobreProducto(producto, mensaje) {
        const notif = document.createElement('div');
        notif.classList.add('flotante-notificacion');
        notif.textContent = mensaje;
        producto.appendChild(notif);
        setTimeout(() => {
            notif.remove();
        }, 1000); // dura 1 segundo
    }

    // Agregar productos al carrito
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);

            const itemExistente = carrito.find(item => item.id === id);
            if (itemExistente) {
                itemExistente.cantidad += 1;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }

            actualizarCarrito();
            mostrarNotificacionSobreProducto(producto, "Agregado al carrito!");
        });
    });

    // Abrir modal solo cuando se hace clic
    carritoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        actualizarCarrito();
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // WhatsApp
    whatsappBtn.addEventListener('click', () => {
        if (carrito.length === 0) return alert("Tu carrito está vacío!");

        let mensaje = "Hola! Quiero comprar:\n";
        carrito.forEach(item => {
            mensaje += `- ${item.nombre} x${item.cantidad}\n`;
        });
        mensaje += `Total: $${totalSpan.textContent}`;
        const numero = "+543364398022";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    });

    // Inicializar contador de carrito sin abrir modal
    actualizarCarrito();
});
