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
            li.classList.add('carrito-item');
            li.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" class="carrito-img">
                <div class="carrito-info">
                    <strong>${item.nombre}</strong> - $${(item.precio*item.cantidad).toFixed(2)}
                    <div class="cantidad-controls">
                        <button class="menos">-</button>
                        <span>${item.cantidad}</span>
                        <button class="mas">+</button>
                        <button class="eliminar">x</button>
                    </div>
                </div>
            `;
            carritoLista.appendChild(li);
            total += item.precio*item.cantidad;

            li.querySelector('.mas').addEventListener('click', () => { item.cantidad++; actualizarCarrito(); });
            li.querySelector('.menos').addEventListener('click', () => { if(item.cantidad>1) item.cantidad--; actualizarCarrito(); });
            li.querySelector('.eliminar').addEventListener('click', () => { carrito = carrito.filter(i => i.id !== item.id); actualizarCarrito(); });
        });

        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.reduce((acc,i)=>acc+i.cantidad,0)})`;

        document.querySelectorAll('.producto').forEach(prod => {
            const id = prod.dataset.id;
            const item = carrito.find(i=>i.id===id);
            prod.querySelector('.cantidad-agregada').textContent = item ? item.cantidad : 0;
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function mostrarNotificacionSobreProducto(producto, mensaje) {
        const notif = document.createElement('div');
        notif.classList.add('flotante-notificacion');
        notif.textContent = mensaje;
        producto.appendChild(notif);
        setTimeout(()=>notif.remove(),1000);
    }

    // ---------------- AGREGAR PRODUCTOS ----------------
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', e => {
            const producto = e.target.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);
            const imagen = producto.querySelector('img').src;

            const itemExistente = carrito.find(i=>i.id===id);
            if(itemExistente) itemExistente.cantidad++;
            else carrito.push({id,nombre,precio,cantidad:1,imagen});

            actualizarCarrito();
            mostrarNotificacionSobreProducto(producto,"Agregado al carrito!");
        });
    });

    carritoBtn.addEventListener('click', ()=>{ modal.style.display='block'; actualizarCarrito(); });
    closeBtn.addEventListener('click', ()=>{ modal.style.display='none'; });
    window.addEventListener('click', e=>{ if(e.target===modal) modal.style.display='none'; });

    whatsappBtn.addEventListener('click', ()=>{
        if(carrito.length===0) return alert("Tu carrito está vacío!");
        let mensaje="Hola! Quiero comprar:\n";
        carrito.forEach(i=>mensaje+=`- ${i.nombre} x${i.cantidad}\n`);
        mensaje+=`Total: $${totalSpan.textContent}`;
        const numero="+543364398022";
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,"_blank");
    });

    actualizarCarrito();

    // ---------------- PINES AUTOMÁTICOS ----------------
    const pinesGrid = document.getElementById("pines-grid");
    const pines = [
        { archivo: "1.jpg", nombre: "Marge", precio: 2000 },
        { archivo: "2.jpg", nombre: "Nirvana", precio: 2000 },
        { archivo: "3.jpg", nombre: "Gorillaz", precio: 2000 },
        { archivo: "4.jpg", nombre: "Pin Sonrisa", precio: 2000 },
        { archivo: "5.png", nombre: "Pin Unicornio", precio: 2000 },
        { archivo: "6.jpg", nombre: "Pin Corazón", precio: 2000 },
        { archivo: "7.jpg", nombre: "Pin Estrella", precio: 2000 },
        { archivo: "8.jpg", nombre: "Pin Sonrisa", precio: 2000 },
        { archivo: "9.png", nombre: "Pin Unicornio", precio: 2000 },
        { archivo: "10.jpg", nombre: "Pin Corazón", precio: 2000 },
        { archivo: "11.jpg", nombre: "Pin Estrella", precio: 2000 },
        { archivo: "12.jpg", nombre: "Pin Sonrisa", precio: 2000 },
        { archivo: "13.png", nombre: "Pin Unicornio", precio: 2000 },
        { archivo: "14.jpg", nombre: "Pin Corazón", precio: 2000 },
        { archivo: "15.jpg", nombre: "Pin Estrella", precio: 2000 },
        { archivo: "16.jpg", nombre: "Pin Sonrisa", precio: 2000 },
        // agrega más pines aquí
    ];

    let nextId = 4;

    pines.forEach(pin=>{
        const div = document.createElement("div");
        div.classList.add("producto");
        div.dataset.id = nextId.toString();
        div.dataset.nombre = pin.nombre;
        div.dataset.precio = pin.precio;

        div.innerHTML = `
            <img src="images/pines/${pin.archivo}" alt="${pin.nombre}">
            <h3>${pin.nombre}</h3>
            <p>$${pin.precio}</p>
            <button class="agregar-carrito">Agregar</button>
            <span class="cantidad-agregada">0</span>
        `;
        pinesGrid.appendChild(div);

        div.querySelector(".agregar-carrito").addEventListener("click",()=>{
            const id = div.dataset.id;
            const nombre = div.dataset.nombre;
            const precio = parseFloat(div.dataset.precio);
            const imagen = div.querySelector('img').src;

            const itemExistente = carrito.find(i=>i.id===id);
            if(itemExistente) itemExistente.cantidad++;
            else carrito.push({id,nombre,precio,cantidad:1,imagen});

            actualizarCarrito();
            mostrarNotificacionSobreProducto(div,"Agregado al carrito!");
        });

        nextId++;
    });

});
