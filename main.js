class Evento {
    #id; #nombre; #fecha; #ciudad; #categoria; #aforoMaximo; #inscritosActuales; #estado; #imagen; 
    #destacado;

    constructor(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales = 0, estado = 'DISPONIBLE', imagen = '', destacado = false) {
        this.#id = id;
        this.#nombre = nombre;
        this.#fecha = fecha;
        this.#ciudad = ciudad;
        this.#categoria = categoria;
        this.#aforoMaximo = aforoMaximo;
        this.#inscritosActuales = inscritosActuales;
        this.#estado = estado;
        this.#imagen = imagen;
        this.#destacado = destacado;
    }

    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get fecha() { return this.#fecha; }
    get ciudad() { return this.#ciudad; }
    get categoria() { return this.#categoria; }
    get aforoMaximo() { return this.#aforoMaximo; }
    get inscritosActuales() { return this.#inscritosActuales; }
    get estado() { return this.#estado; }
    get imagen() { return this.#imagen; }
    get destacado() { return this.#destacado; }

    set inscritosActuales(nuevoValor) {
        if (nuevoValor >= 0 && nuevoValor <= this.#aforoMaximo) {
            this.#inscritosActuales = nuevoValor;
            this.#actualizarEstadoAutomatico();
        }
    }

    #actualizarEstadoAutomatico() {
        if (this.#estado !== 'FINALIZADO') {
            this.#estado = this.#inscritosActuales >= this.#aforoMaximo ? 'LLENO' : 'DISPONIBLE';
        }
    }

    registrarInscripcion() {
        if (this.#estado === 'DISPONIBLE' && this.#inscritosActuales < this.#aforoMaximo) {
            this.#inscritosActuales++;
            this.#actualizarEstadoAutomatico();
            return true;
        }
        return false;
    }

    cancelarInscripcion() {
        if (this.#inscritosActuales > 0) {
            this.#inscritosActuales--;
            this.#actualizarEstadoAutomatico();
            return true;
        }
        return false;
    }

/*
    Método polimórfico
    -------------------------------
*/    
    obtenerDetallesEspeciales() {
        return `<p class="mb-1 text-muted small"><i class="bi bi-info-circle me-1"></i> Evento estándar.</p>`;
    }
}

/*  
    Subclace 1
    -------------------------------
*/
class EventoCompetencia extends Evento {
    #premio; #requiereLicencia;

    constructor(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado, imagen, destacado, premio, requiereLicencia = true) {
        super(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado, imagen, destacado);
        this.#premio = premio;
        this.#requiereLicencia = requiereLicencia;
    }

    obtenerDetallesEspeciales() {
        return `
            <div class="alert alert-warning py-2 px-3 mb-2 small border-warning">
                <div class="fw-bold"><i class="bi bi-trophy-fill me-1"></i> Competencia</div>
                <div><strong>Premio:</strong> ${this.#premio}</div>
                <div><strong>Requisito:</strong> ${this.#requiereLicencia ? 'Licencia deportiva vigente exigida.' : 'Apto para amateur.'}</div>
            </div>`;
    }
}

/*
    Subclase 2
    -------------------------------
*/
class EventoFeria extends Evento {
    #numeroExpositores; #aptoFamilia;

    constructor(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado, imagen, destacado, numeroExpositores, aptoFamilia = true) {
        super(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado, imagen, destacado);
        this.#numeroExpositores = numeroExpositores;
        this.#aptoFamilia = aptoFamilia;
    }

    obtenerDetallesEspeciales() {
        return `
            <div class="alert alert-info py-2 px-3 mb-2 small border-info">
                <div class="fw-bold"><i class="bi bi-people-fill me-1"></i> Feria de Exhibición</div>
                <div><strong>Marcas:</strong> Más de ${this.#numeroExpositores} expositores.</div>
                <div><strong>Ambiente:</strong> ${this.#aptoFamilia ? '100% Familiar.' : 'Solo adultos.'}</div>
            </div>`;
    }
}

/*
    Clase de operaciones
*/

class GestorEventos {
    #catalogo; #idsInscritosUsuario; 

    constructor() {
        this.#catalogo = [];
        this.#idsInscritosUsuario = new Set(); 
    }

/*
    Mockdata
    -------------------------
*/
    inicializarDatos() {
        this.#catalogo = [
            new EventoFeria(1, "Lima Classic Car Show 2025", "15 Mar 2025", "Lima", "Clásicos", 150, 103, "DISPONIBLE", "img/clasicos.jpg", true, 45, true),
            new EventoCompetencia(2, "Rally Tierra de Los Andes", "22 Mar 2025", "Arequipa", "Rally", 50, 38, "DISPONIBLE", "img/rally.jpg", true, "S/. 15,000 + Trofeo", true),
            new EventoFeria(3, "Moto Fest Trujillo", "29 Mar 2025", "Trujillo", "Motos", 300, 166, "DISPONIBLE", "img/motos.jpg", false, 25, true),
            new EventoCompetencia(4, "Tuning Show Callao", "05 Abr 2025", "Callao", "Tuning", 80, 80, "LLENO", "img/tuning.jpg", false, "Kit Audio Pioneer", false),
            new EventoFeria(5, "Feria Automotriz Peru Motor", "12 Abr 2025", "Lima", "Feria", 600, 80, "DISPONIBLE", "img/feria.jpg", false, 80, true),
            new EventoCompetencia(6, "Supercar Day Miraflores", "19 Abr 2025", "Lima", "Deportivos", 40, 40, "FINALIZADO", "img/deportivos.jpg", false, "Exhibición VIP", true)
        ];
    }

    obtenerTodos() { return this.#catalogo; }
    obtenerPorId(id) { return this.#catalogo.find(e => e.id === id); }

    filtrarEventos(criterio, categoria, ciudad) {
        return this.#catalogo.filter(e => {
            const txt = !criterio || e.nombre.toLowerCase().includes(criterio.toLowerCase()) || e.ciudad.toLowerCase().includes(criterio.toLowerCase());
            const cat = categoria === 'TODOS' || e.categoria === categoria;
            const ciu = ciudad === 'TODOS' || e.ciudad === ciudad;
            return txt && cat && ciu;
        });
    }
/*
    Metodos para verificar inscripción
    --------------------------------------
*/
    estaInscrito(idEvento) { return this.#idsInscritosUsuario.has(idEvento); }
    obtenerEventosInscritos() { return this.#catalogo.filter(e => this.#idsInscritosUsuario.has(e.id)); }

/*
    Metodos para inscribir y cancelar inscripción
    -----------------------------------------------
*/
    inscribirUsuario(idEvento) {
        if (this.estaInscrito(idEvento)) return { exito: false, mensaje: "Ya estás inscrito." };
        const evento = this.obtenerPorId(idEvento);
        if (!evento) return { exito: false, mensaje: "Evento no encontrado." };
        if (evento.estado !== 'DISPONIBLE') return { exito: false, mensaje: `Evento ${evento.estado.toLowerCase()}.` };
        
        if (evento.registrarInscripcion()) {
            this.#idsInscritosUsuario.add(idEvento);
            return { exito: true, mensaje: `¡Inscripción exitosa en ${evento.nombre}!` };
        }
        return { exito: false, mensaje: "No hay cupos disponibles." };
    }

    cancelarInscripcionUsuario(idEvento) {
        if (!this.estaInscrito(idEvento)) return { exito: false, mensaje: "No estás inscrito." };
        const evento = this.obtenerPorId(idEvento);
        if (evento && evento.cancelarInscripcion()) {
            this.#idsInscritosUsuario.delete(idEvento);
            return { exito: true, mensaje: `Inscripción cancelada. Cupo liberado.` };
        }
        return { exito: false, mensaje: "Error al cancelar." };
    }
}

/*
    Interacción con el DOM
    -------------------------------
*/
const gestor = new GestorEventos();
gestor.inicializarDatos();

let idEventoSeleccionado = null;
let idEventoACancelar = null;
let modalDetalleBootstrap, modalCancelacionBootstrap, toastBootstrap;

document.addEventListener('DOMContentLoaded', () => {
    modalDetalleBootstrap = new bootstrap.Modal(document.getElementById('modalDetalleEvento'));
    modalCancelacionBootstrap = new bootstrap.Modal(document.getElementById('modalConfirmarCancelacion'));
    toastBootstrap = new bootstrap.Toast(document.getElementById('liveToast'));

    renderizarCarrusel();
    aplicarFiltros(); 
    actualizarContadorMisEventos();
    configurarEventosNavegacion();
    configurarEventosFiltros();
    configurarAlternadorTema();
    configurarAccionesModales();
});

function renderizarCarrusel() {
    const eventosDestacados = gestor.obtenerTodos().filter(e => e.destacado);
    const indicadores = document.getElementById('carrusel-indicadores');
    const contenido = document.getElementById('carrusel-contenido');

    if (eventosDestacados.length === 0) {
        document.getElementById('carruselPrincipal').style.display = 'none';
        return;
    }

    indicadores.innerHTML = '';
    contenido.innerHTML = '';

    eventosDestacados.forEach((evento, index) => {
        const activo = index === 0 ? 'active' : '';

        // Botones indicadores inferiores
        indicadores.insertAdjacentHTML('beforeend', `
            <button type="button" data-bs-target="#carruselPrincipal" data-bs-slide-to="${index}" class="${activo}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
        `);

        // Slide con la imagen original del evento
        contenido.insertAdjacentHTML('beforeend', `
            <div class="carousel-item ${activo}">
                <div class="carrusel-img bg-dark position-relative">
                    <img src="${evento.imagen}" class="d-block w-100 h-100 object-fit-cover opacity-75" alt="${evento.nombre}" onerror="this.style.display='none'">
                </div>
                <div class="carousel-caption d-none d-md-block text-white text-shadow text-start ms-4 mb-4 pe-4">
                    <span class="badge bg-warning text-dark mb-2"><i class="bi bi-star-fill me-1"></i>Evento Destacado</span>
                    <h2 class="fw-bold display-5">${evento.nombre}</h2>
                    <p class="fs-5"><i class="bi bi-geo-alt-fill me-1"></i>${evento.ciudad} | <i class="bi bi-calendar3 me-1"></i>${evento.fecha}</p>
                    <button class="btn btn-primary fw-bold mt-2 px-4 shadow-sm" onclick="abrirModalDetalle(${evento.id})">Ver información e Inscribirse</button>
                </div>
            </div>
        `);
    });
}

function generarTarjetaHTML(evento) {
    let claseBadge = evento.estado === 'LLENO' ? 'badge-lleno' : (evento.estado === 'FINALIZADO' ? 'badge-finalizado' : 'badge-disponible');
    
    let botonHTML = gestor.estaInscrito(evento.id) 
        ? `<button class="btn btn-secondary btn-accion-tarjeta opacity-75" disabled><i class="bi bi-check-circle-fill me-1"></i> Ya inscrito</button>`
        : `<button class="btn btn-outline-secondary btn-accion-tarjeta" onclick="abrirModalDetalle(${evento.id})">Ver detalle →</button>`;

    let htmlDestacado = evento.destacado 
        ? `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2 shadow-sm z-1"><i class="bi bi-star-fill me-1"></i>Destacado</span>` 
        : '';

    return `
        <div class="col-12 col-sm-6 col-lg-4">
            <div class="card-evento">
                <div class="contenedor-imagen-evento position-relative">
                    ${htmlDestacado}
                    <img src="${evento.imagen}" alt="${evento.nombre}" class="img-evento" onerror="this.style.display='none'">
                </div>
                <div class="p-3 d-flex flex-column flex-grow-1 gap-2">
                    <div class="d-flex justify-content-between align-items-start gap-2">
                        <h3 class="h6 fw-bold mb-0">${evento.nombre}</h3>
                        <span class="badge ${claseBadge}">${evento.estado}</span>
                    </div>
                    <div class="small text-muted d-flex flex-column gap-1 my-1">
                        <div><i class="bi bi-calendar3 me-2"></i><strong>Fecha:</strong> ${evento.fecha}</div>
                        <div><i class="bi bi-geo-alt me-2"></i><strong>Ciudad:</strong> ${evento.ciudad}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                        <span class="badge badge-categoria">${evento.categoria}</span>
                        <span class="font-monospace small text-muted">${evento.inscritosActuales}/${evento.aforoMaximo} cupos</span>
                    </div>
                    <div class="pt-2">${botonHTML}</div>
                </div>
            </div>
        </div>
    `;
}

function aplicarFiltros() {
    const texto = document.getElementById('input-busqueda').value;
    const categoria = document.getElementById('filtro-categoria').value;
    const ciudad = document.getElementById('filtro-ciudad').value;
    
    renderizarCatalogo(gestor.filtrarEventos(texto, categoria, ciudad));
}

function renderizarCatalogo(eventos) {
    const contenedor = document.getElementById('contenedor-eventos');
    document.getElementById('texto-resultados').textContent = `${eventos.length} evento(s) encontrado(s)`;
    contenedor.innerHTML = '';

    if (eventos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center py-5"><i class="bi bi-search display-4 text-muted"></i><p class="mt-3 text-muted">No encontramos eventos que coincidan.</p></div>`;
        return;
    }

    eventos.forEach(evento => contenedor.insertAdjacentHTML('beforeend', generarTarjetaHTML(evento)));
}

/*
    Función para alternar tema claro/oscuro
    ------------------------------------------------------------------------------------------------
*/
function configurarAlternadorTema() { 
    const btnTheme = document.getElementById('btn-theme-toggle');
    const htmlElement = document.documentElement;

    btnTheme.addEventListener('click', () => {
        const nuevoTema = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', nuevoTema);
        
        const icon = btnTheme.querySelector('i');
        if (nuevoTema === 'dark') {
            icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
            btnTheme.classList.replace('btn-secondary', 'btn-light');
        } else {
            icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
            btnTheme.classList.replace('btn-light', 'btn-secondary');
        }
    });
}
/*
    ----------------------------------------------------------------------------------------------------
*/

function configurarEventosNavegacion() {
    const seccionCatalogo = document.getElementById('seccion-catalogo');
    const seccionMisEventos = document.getElementById('seccion-mis-eventos');
    const btnCatalogo = document.getElementById('btn-tab-catalogo');
    const btnMisEventos = document.getElementById('btn-tab-mis-eventos');

    const mostrarCatalogo = () => {
        seccionCatalogo.classList.remove('d-none');
        seccionMisEventos.classList.add('d-none');
        btnCatalogo.classList.add('active');
        btnMisEventos.classList.remove('active');
        aplicarFiltros();
    };

    const mostrarMisEventos = () => {
        seccionCatalogo.classList.add('d-none');
        seccionMisEventos.classList.remove('d-none');
        btnCatalogo.classList.remove('active');
        btnMisEventos.classList.add('active');
        renderizarMisEventos();
    };

    btnCatalogo.addEventListener('click', mostrarCatalogo);
    document.getElementById('btn-volver-catalogo').addEventListener('click', mostrarCatalogo);
    btnMisEventos.addEventListener('click', mostrarMisEventos);
}

function configurarEventosFiltros() {
    document.getElementById('input-busqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-ciudad').addEventListener('change', aplicarFiltros);
    
    document.getElementById('btn-limpiar-filtros').addEventListener('click', () => {
        document.getElementById('input-busqueda').value = '';
        document.getElementById('filtro-categoria').value = 'TODOS';
        document.getElementById('filtro-ciudad').value = 'TODOS';
        aplicarFiltros();
    });
}

function renderizarMisEventos() {
    const contenedor = document.getElementById('contenedor-mis-eventos');
    const eventosInscritos = gestor.obtenerEventosInscritos();
    contenedor.innerHTML = '';

    if (eventosInscritos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-calendar-x display-4 text-muted"></i>
                <h3 class="h5 mt-3 fw-bold">Aún no te has inscrito en ningún evento</h3>
                <p class="text-muted small">Explora nuestro catálogo y regístrate.</p>
            </div>`;
        return;
    }

    eventosInscritos.forEach(evento => {
        contenedor.insertAdjacentHTML('beforeend', `
            <div class="col-12 col-md-6">
                <div class="card-evento border-primary">
                    <div class="p-4 d-flex flex-column gap-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <span class="badge bg-primary mb-1">Inscripción Confirmada</span>
                                <h3 class="h5 fw-bold mb-0">${evento.nombre}</h3>
                            </div>
                            <span class="font-monospace text-muted small">${evento.fecha}</span>
                        </div>
                        ${evento.obtenerDetallesEspeciales()}
                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span class="text-muted small"><i class="bi bi-pin-map me-1"></i>${evento.ciudad}</span>
                            <button class="btn btn-sm btn-outline-danger fw-bold" onclick="prepararCancelacion(${evento.id})">
                                <i class="bi bi-x-circle me-1"></i> Cancelar inscripción
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function abrirModalDetalle(id) {
    const evento = gestor.obtenerPorId(id);
    if (!evento) return;
    idEventoSeleccionado = id;
    
    document.getElementById('modal-titulo').textContent = evento.nombre;
    document.getElementById('modal-cuerpo').innerHTML = `
        <img src="${evento.imagen}" class="img-fluid rounded-3 mb-3 border" alt="${evento.nombre}" onerror="this.style.display='none'">
        <div class="mb-3">
            <span class="badge badge-categoria me-2">${evento.categoria}</span>
            <span class="badge bg-secondary">${evento.ciudad}</span>
        </div>
        <div class="mb-3">${evento.obtenerDetallesEspeciales()}</div>
        <ul class="list-group list-group-flush small border-top pt-2">
            <li class="list-group-item d-flex justify-content-between border-0 px-0">
                <strong><i class="bi bi-calendar-event me-2"></i>Fecha:</strong> <span>${evento.fecha}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between border-0 px-0">
                <strong><i class="bi bi-people me-2"></i>Cupos:</strong> <span>${evento.inscritosActuales} / ${evento.aforoMaximo}</span>
            </li>
        </ul>
    `;

    const pie = document.getElementById('modal-pie');
    if (gestor.estaInscrito(id)) {
        pie.innerHTML = `<button type="button" class="btn btn-secondary w-100 opacity-75" disabled>Ya estás inscrito</button>`;
    } else if (evento.estado !== 'DISPONIBLE') {
        pie.innerHTML = `<button type="button" class="btn btn-secondary w-100 opacity-75" disabled>Evento ${evento.estado}</button>`;
    } else {
        pie.innerHTML = `<button type="button" class="btn btn-primary w-100 fw-bold" id="btn-procesar-inscripcion">Inscribirme al evento</button>`;
        document.getElementById('btn-procesar-inscripcion').addEventListener('click', () => {
            const res = gestor.inscribirUsuario(id);
            if (res.exito) {
                modalDetalleBootstrap.hide();
                mostrarToast(res.mensaje, 'exito');
                actualizarContadorMisEventos();
                aplicarFiltros();
            } else {
                mostrarToast(res.mensaje, 'error');
            }
        });
    }
    modalDetalleBootstrap.show();
}

function prepararCancelacion(id) {
    idEventoACancelar = id;
    modalCancelacionBootstrap.show();
}

function configurarAccionesModales() {
    document.getElementById('btn-confirmar-revocacion').addEventListener('click', () => {
        if (idEventoACancelar) {
            const res = gestor.cancelarInscripcionUsuario(idEventoACancelar);
            modalCancelacionBootstrap.hide();
            if (res.exito) {
                mostrarToast(res.mensaje, 'advertencia');
                actualizarContadorMisEventos();
                renderizarMisEventos();
                aplicarFiltros(); 
            } else {
                mostrarToast(res.mensaje, 'error');
            }
        }
    });
}

function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.getElementById('liveToast');
    const body = document.getElementById('toast-mensaje');
    toast.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');
    
    if (tipo === 'exito') {
        toast.classList.add('text-bg-success');
        body.innerHTML = `<i class="bi bi-check-circle-fill fs-5 me-2"></i> <span>${mensaje}</span>`;
    } else if (tipo === 'advertencia') {
        toast.classList.add('text-bg-warning');
        body.innerHTML = `<i class="bi bi-exclamation-triangle-fill fs-5 me-2 text-dark"></i> <span class="text-dark">${mensaje}</span>`;
    } else {
        toast.classList.add('text-bg-danger');
        body.innerHTML = `<i class="bi bi-x-circle-fill fs-5 me-2"></i> <span>${mensaje}</span>`;
    }
    toastBootstrap.show();
}

function actualizarContadorMisEventos() {
    document.getElementById('contador-mis-eventos').textContent = gestor.obtenerEventosInscritos().length;
}