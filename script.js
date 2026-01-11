document.addEventListener('DOMContentLoaded', () => {

    const carritoBtn = document.getElementById('carrito-btn');
    const modal = document.getElementById('carrito-modal');
    const closeBtn = document.querySelector('.close');
    const lista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('total');
    const whatsappBtn = document.getElementById('whatsapp');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizar() {
        lista.innerHTML = '';
        let total = 0;

        carrito.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.nombre} x${p.cantidad} (${p.archivo || 'sin archivo'})`;
            lista.appendChild(li);
            total += p.precio * p.cantidad;
        });

        totalSpan.textContent = total.toLocaleString('es-AR');
        carritoBtn.textContent = `Carrito (${carrito.reduce((a,p)=>a+p.cantidad,0)})`;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.onclick = e => {
            const producto = e.target.closest('.producto');
            const fileInput = producto.querySelector('.archivo');

            producto.classList.add('pop');
            setTimeout(()=>producto.classList.remove('pop'),300);

            const { id, nombre, precio } = producto.dataset;
            const archivo = fileInput.files[0]?.name || '';

            const existe = carrito.find(p => p.id === id && p.archivo === archivo);
            if (existe) {
                existe.cantidad++;
            } else {
                carrito.push({ id, nombre, precio: Number(precio), cantidad: 1, archivo });
            }

            actualizar();
        };
    });

    carritoBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = e => e.target === modal && (modal.style.display = 'none');

    whatsappBtn.onclick = () => {
        let msg = 'Hola! Quiero hacer este pedido:%0A%0A';
        carrito.forEach(p => {
            msg += `• ${p.nombre} x${p.cantidad}%0A`;
        });
        msg += `%0ATotal: $${totalSpan.textContent}`;
        window.open(`https://wa.me/549XXXXXXXXXX?text=${msg}`, '_blank');
    };

    actualizar();
});
