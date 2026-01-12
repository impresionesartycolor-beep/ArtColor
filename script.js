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
        let totalPines = 0;
        let pinesItems = [];

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="images/${item.tipo==='pin'?'pines/':''}${item.archivo}" alt="${item.nombre}">
                <strong>${item.nombre}</strong> - $${(item.precio*item.cantidad).toFixed(2)}
                <div class="cantidad-controls">
                    <button class="menos">-</button>
                    <span>${item.cantidad}</span>
                    <button class="mas">+</button>
                    <button class="eliminar">x</button>
                </div>
            `;
            carritoLista.appendChild(li);
            total += item.precio*item.cantidad;

            if(item.tipo==='pin'){
                totalPines+=item.cantidad;
                for(let i=0;i<item.cantidad;i++){ pinesItems.push(item.precio); }
            }

            li.querySelector('.mas').addEventListener('click',()=>{ item.cantidad+=1; actualizarCarrito(); });
            li.querySelector('.menos').addEventListener('click',()=>{ if(item.cantidad>1)item.cantidad-=1; actualizarCarrito(); });
            li.querySelector('.eliminar').addEventListener('click',()=>{ carrito = carrito.filter(i=>i.id!==item.id); actualizarCarrito(); });
        });

        // Descuento 50% cada 2 pines
        let totalDescuento=0;
        if(totalPines>=2){
            pinesItems.sort((a,b)=>b-a);
            let pares = Math.floor(totalPines/2);
            for(let i=0;i<pares;i++){ totalDescuento+=pinesItems[i]*0.5; }
            total -= totalDescuento;
        }

        const descuentoExistente = document.getElementById('descuento');
        if(descuentoExistente) descuentoExistente.remove();
        if(totalDescuento>0){
            const p = document.createElement('p');
            p.id="descuento";
            p.style.fontWeight="bold";
            p.style.color="#FF00FF";
            p.textContent = `Descuento aplicado: $${totalDescuento.toFixed(2)}`;
            modal.querySelector('.modal-content').insertBefore(p,totalSpan.parentElement);
        }

        totalSpan.textContent = total.toFixed(2);
        carritoBtn.textContent = `Carrito (${carrito.reduce((acc,i)=>acc+i.cantidad,0)})`;

        document.querySelectorAll('.producto').forEach(prod=>{
            const id=prod.dataset.id;
            const item = carrito.find(i=>i.id===id);
            prod.querySelector('.cantidad-agregada').textContent = item?item.cantidad:0;
        });

        localStorage.setItem('carrito',JSON.stringify(carrito));
    }

    function mostrarNotificacionSobreProducto(producto,mensaje){
        const notif = document.createElement('div');
        notif.classList.add('flotante-notificacion');
        notif.textContent=mensaje;
        producto.appendChild(notif);
        setTimeout(()=>notif.remove(),1000);
    }

    // Delegación de eventos para todos los botones agregar-carrito
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);
            const archivo = producto.querySelector('img').getAttribute('src');
            const tipo = producto.dataset.tipo || 'producto';

            const itemExistente = carrito.find(i=>i.id===id);
            if(itemExistente)itemExistente.cantidad+=1;
            else carrito.push({id,nombre,precio,cantidad:1,archivo:archivo.split('/').pop(),tipo});

            actualizarCarrito();
            mostrarNotificacionSobreProducto(producto,"Agregado al carrito!");
        }
    });

    carritoBtn.addEventListener('click',()=>{ modal.style.display='block'; actualizarCarrito(); });
    closeBtn.addEventListener('click',()=>{ modal.style.display='none'; });
    window.addEventListener('click', e=>{ if(e.target===modal) modal.style.display='none'; });

    whatsappBtn.addEventListener('click',()=>{
        if(carrito.length===0) return alert("Tu carrito está vacío!");
        let mensaje="Hola! Quiero comprar:\n";
        carrito.forEach(i=>mensaje+=`- ${i.nombre} x${i.cantidad}\n`);
        mensaje+=`Total: $${totalSpan.textContent}`;
        const numero="+543364398022";
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,"_blank");
    });

    // ---------------- PINES INFINITOS ----------------
    const pinesGrid = document.getElementById("pines-grid");
    const pines = [];
    for(let i=1;i<=1000;i++){
        pines.push({archivo:`${i}.jpg`,nombre:`Pin ${i}`,precio:2000});
    }
    let nextId=3;
    pines.forEach(pin=>{
        const img = new Image();
        img.src=`images/pines/${pin.archivo}`;
        img.onload=()=>{
            nextId++;
            const div=document.createElement('div');
            div.classList.add('producto');
            div.dataset.id=nextId.toString();
            div.dataset.nombre=pin.nombre;
            div.dataset.precio=pin.precio;
            div.dataset.tipo='pin';

            div.innerHTML=`
                <img src="images/pines/${pin.archivo}" alt="${pin.nombre}">
                <h3>${pin.nombre}</h3>
                <p>$${pin.precio}</p>
                <button class="agregar-carrito">Agregar</button>
                <span class="cantidad-agregada">0</span>
            `;
            pinesGrid.appendChild(div);
        };
    });

    actualizarCarrito();
});
