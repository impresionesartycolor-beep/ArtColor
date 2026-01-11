document.addEventListener('DOMContentLoaded', () => {

    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const carritoLista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const comprarBtn = document.getElementById('comprar');

    const WHATSAPP_NUMBER = "54911XXXXXXXX"; // ← poné tu número

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nombre} - $${item.precio}`;
            carritoLista.appendChild(li);
            total += Number(item.precio);
        });

        totalSpan.textContent = total;
        carritoBtn.textContent = `Carrito (${carrito.length})`;

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');

            carrito.push({
                id: producto.dataset.id,
                nombre: producto.dataset.nombre,
                precio: producto.dataset.precio,
                imagen: producto.dataset.imagen
            });

            actualizarCarrito();
            alert('Producto agregado al carrito');
        });
    });

    carritoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        actualizarCarrito();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    comprarBtn.addEventListener('click', () => {

        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const nombre = document.getElementById('cliente-nombre').value.trim();
        const nota = document.getElementById('cliente-nota').value.trim();

        if (!nombre) {
            alert('Por favor ingresá tu nombre');
            return;
        }

        let mensaje = 'Hola! Quiero hacer el siguiente pedido:%0A%0A';
        mensaje += `Nombre: ${nombre}%0A`;

        if (nota) {
            mensaje += `Aclaración: ${nota}%0A`;
        }

        mensaje += `%0A`;

        let total = 0;

        carrito.forEach(item => {
            mensaje += `• ${item.nombre} - $${item.precio}%0A`;
            total += Number(item.precio);
        });

        mensaje += `%0A*Total: $${total}*`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
        window.open(url, '_blank');
    });

    actualizarCarrito();
});
