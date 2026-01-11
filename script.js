document.addEventListener('DOMContentLoaded', () => {
    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const whatsappBtn = document.getElementById('whatsapp');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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
                if (item.cantidad > 1) item.cantidad -= 1;
                actualizarCarrito();
            });

            li.querySelector('.eliminar').addEventListener('click', () => {
                carrito = carrito.filter(i => i.id !== item.id);
                actualizarCarrito();
            });
        });

        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.reduce((acc,i)=>acc+i.cantidad,0)})`;

        document.querySelectorAll('.producto').forEach(prod => {
            const id = prod.dataset.id;
            const item = carrito.find(i => i.id === id);
            prod.querySelector('.cantidad-agregada').textContent = item ? item.cantidad : 0;
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function mostrarNotificacionSobreProducto(producto, mensaje) {
        const notif = document.createElement('div');
        notif.classList.add('flotante-notificacion');
        notif.textContent = mensaje;
        producto.appendChild(notif);
        setTimeout(() => notif.remove(), 1000);
    }

    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);

            const itemExistente = carrito.find(i => i.id === id);
            if (itemExistente) itemExistente.cantidad += 1;
            else carrito.push({id,nombre,precio,cantidad:1});

            actualizarCarrito();
            mostrarNotificacionSobreProducto(producto, "¡Agregado al carrito!");
        });
    });

    carritoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        actualizarCarrito();
    });

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

    window.addEventListener('click', (e) => { if(e.target===modal) modal.style.display='none'; });

    whatsappBtn.addEventListener('click', () => {
        if(carrito.length===0) return alert("Tu carrito está vacío!");
        let mensaje="Hola! Quiero comprar:\n";
        carrito.forEach(i=>mensaje+=`- ${i.nombre} x${i.cantidad}\n`);
        mensaje+=`Total: $${totalSpan
