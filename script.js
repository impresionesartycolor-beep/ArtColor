document.addEventListener('DOMContentLoaded', () => {
    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const whatsappBtn = document.getElementById('whatsapp');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Actualizar carrito en UI
    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.nombre} - $${item.precio * item.cantidad}
                <div class="cantidad-controls">
                    <button class="menos">-</button>
                    <span>${item.cantidad}</span>
                    <button class="mas">+</button>
                    <button class="eliminar">x</button>
                </div>
            `;
            carritoLista.appendChild(li);
            total += item.precio * item.cantidad;

            // Botones +
            li.querySelector('.mas').addEventListener('click', () => {
                item.cantidad += 1;
                actualizarCarrito();
            });

            // Botones -
            li.querySelector('.menos').addEventListener('click', () => {
                if (item.cantidad > 1) item.cantidad -= 1;
                actualizarCarrito();
            });

            // Botón eliminar
            li.querySelector('.eliminar').addEventListener('click', () => {
                carrito = carrito.filter(i => i.id !== item.id);
                actualizarCarrito();
            });
        });

        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.length})`;
        localStorage.setItem('carrito', JSON.stringify(carrito));
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
        });
    });

    // Abrir modal
    carritoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        actualizarCarrito();
    });

    // Cerrar modal con X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer click afuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Finalizar por WhatsApp
    whatsappBtn.addEventListener('click', () => {
        let mensaje = "Hola! Quiero comprar:\n";
        carrito.forEach(item => {
            mensaje += `- ${item.nombre} x${item.cantidad}\n`;
        });
        mensaje += `Total: $${totalSpan.textContent}`;
        const numero = "+543364398022";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    });

    actualizarCarrito();
});
