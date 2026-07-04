/* ==========================================================================
   PASO 3: NÚCLEO POO — CLASES, ENCAPSULAMIENTO, HERENCIA Y POLIMORFISMO
   ========================================================================== */

/**
 * CLASE BASE: Evento
 * Implementa encapsulamiento mediante campos privados (#) y métodos getter/setter.
 */
class Evento {
    #id;
    #nombre;
    #fecha;
    #ciudad;
    #categoria;
    #aforoMaximo;
    #inscritosActuales;
    #estado; // 'DISPONIBLE', 'LLENO', 'FINALIZADO'

    constructor(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales = 0, estado = 'DISPONIBLE') {
        this.#id = id;
        this.#nombre = nombre;
        this.#fecha = fecha;
        this.#ciudad = ciudad;
        this.#categoria = categoria;
        this.#aforoMaximo = aforoMaximo;
        this.#inscritosActuales = inscritosActuales;
        this.#estado = estado;
    }

    // Getters para acceso controlado y seguro a los datos
    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get fecha() { return this.#fecha; }
    get ciudad() { return this.#ciudad; }
    get categoria() { return this.#categoria; }
    get aforoMaximo() { return this.#aforoMaximo; }
    get inscritosActuales() { return this.#inscritosActuales; }
    get estado() { return this.#estado; }

    // Setters con validación de reglas de negocio
    set inscritosActuales(nuevoValor) {
        if (nuevoValor >= 0 && nuevoValor <= this.#aforoMaximo) {
            this.#inscritosActuales = nuevoValor;
            this.#actualizarEstadoAutomatico();
        }
    }

    // Método privado interno para gestionar el estado dinámicamente
    #actualizarEstadoAutomatico() {
        if (this.#estado !== 'FINALIZADO') {
            if (this.#inscritosActuales >= this.#aforoMaximo) {
                this.#estado = 'LLENO';
            } else {
                this.#estado = 'DISPONIBLE';
            }
        }
    }

    // Método para inscribir un participante
    registrarInscripcion() {
        if (this.#estado === 'DISPONIBLE' && this.#inscritosActuales < this.#aforoMaximo) {
            this.#inscritosActuales++;
            this.#actualizarEstadoAutomatico();
            return true;
        }
        return false;
    }

    // Método para cancelar inscripción
    cancelarInscripcion() {
        if (this.#inscritosActuales > 0) {
            this.#inscritosActuales--;
            this.#actualizarEstadoAutomatico();
            return true;
        }
        return false;
    }

    // Método base diseñado para ser sobreescrito (Polimorfismo)
    obtenerDetallesEspeciales() {
        return `<p class="mb-1 text-muted small"><i class="bi bi-info-circle me-1"></i> Evento estándar del circuito automotriz.</p>`;
    }
}

/**
 * SUBCLASE 1: EventoCompetencia (Herencia de Evento)
 * Representa carreras, rallies o exhibiciones competitivas.
 */
class EventoCompetencia extends Evento {
    #premio;
    #requiereLicencia;

    constructor(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado, premio, requiereLicencia = true) {
        super(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado);
        this.#premio = premio;
        this.#requiereLicencia = requiereLicencia;
    }

    // POLIMORFISMO: Sobreescribe el comportamiento base
    obtenerDetallesEspeciales() {
        return `
            <div class="alert alert-warning py-2 px-3 mb-2 small border-warning">
                <div class="fw-bold"><i class="bi bi-trophy-fill me-1"></i> Evento de Competencia</div>
                <div><strong>Premio principal:</strong> ${this.#premio}</div>
                <div><strong>Requisito:</strong> ${this.#requiereLicencia ? 'Licencia deportiva FPDV o SOAT vigente exigido.' : 'Apto para corredores amateur.'}</div>
            </div>
        `;
    }
}

/**
 * SUBCLASE 2: EventoFeria (Herencia de Evento)
 * Representa exhibiciones de autos clásicos, ferias y lanzamientos.
 */
class EventoFeria extends Evento {
    #numeroExpositores;
    #aptoFamilia;

    constructor(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado, numeroExpositores, aptoFamilia = true) {
        super(id, nombre, fecha, ciudad, categoria, aforoMaximo, inscritosActuales, estado);
        this.#numeroExpositores = numeroExpositores;
        this.#aptoFamilia = aptoFamilia;
    }

    // POLIMORFISMO: Sobreescribe el comportamiento base
    obtenerDetallesEspeciales() {
        return `
            <div class="alert alert-info py-2 px-3 mb-2 small border-info">
                <div class="fw-bold"><i class="bi bi-people-fill me-1"></i> Exhibición y Feria</div>
                <div><strong>Stands y marcas:</strong> Más de ${this.#numeroExpositores} expositores confirmados.</div>
                <div><strong>Ambiente:</strong> ${this.#aptoFamilia ? '100% Familiar (Niños menores de 12 años no pagan).' : 'Exclusivo mayores de 18 años.'}</div>
            </div>
        `;
    }
}

/**
 * CLASE CONTROLADORA: GestorEventos
 * Administra la colección de objetos, previene duplicados y gestiona el DOM indirectamente.
 */
class GestorEventos {
    #catalogo;
    #idsInscritosUsuario; // Arreglo que almacena los IDs donde el usuario ya se inscribió

    constructor() {
        this.#catalogo = [];
        this.#idsInscritosUsuario = new Set(); // Set previene automáticamente duplicados
    }

    // Cargar los datos iniciales (Fiel a los 6 eventos de tu Wireframe)
    inicializarDatos() {
        this.#catalogo = [
            new EventoFeria(1, "Lima Classic Car Show 2025", "15 Mar 2025", "Lima", "Clásicos", 150, 103, "DISPONIBLE", 45, true),
            new EventoCompetencia(2, "Rally Tierra de Los Andes", "22 Mar 2025", "Arequipa", "Rally", 50, 38, "DISPONIBLE", "S/. 15,000 + Trofeo", true),
            new EventoFeria(3, "Moto Fest Trujillo", "29 Mar 2025", "Trujillo", "Motos", 300, 166, "DISPONIBLE", 25, true),
            new EventoCompetencia(4, "Tuning Show Callao", "05 Abr 2025", "Callao", "Tuning", 80, 80, "LLENO", "Kit Audio Pioneer + Copa", false),
            new EventoFeria(5, "Feria Automotriz Peru Motor", "12 Abr 2025", "Lima", "Feria", 600, 80, "DISPONIBLE", 80, true),
            new EventoCompetencia(6, "Supercar Day Miraflores", "19 Abr 2025", "Lima", "Deportivos", 40, 40, "FINALIZADO", "Exhibición VIP", true)
        ];
    }

    obtenerTodos() {
        return this.#catalogo;
    }

    obtenerPorId(id) {
        return this.#catalogo.find(evento => evento.id === id);
    }

    // Búsqueda predictiva simultánea y filtrado avanzado (Estructuras de control optimizadas)
    filtrarEventos(criterioBusqueda, categoria, ciudad) {
        return this.#catalogo.filter(evento => {
            const coincideTexto = !criterioBusqueda || 
                evento.nombre.toLowerCase().includes(criterioBusqueda.toLowerCase()) ||
                evento.ciudad.toLowerCase().includes(criterioBusqueda.toLowerCase()) ||
                evento.fecha.toLowerCase().includes(criterioBusqueda.toLowerCase());
            
            const coincideCategoria = categoria === 'TODOS' || evento.categoria === categoria;
            const coincideCiudad = ciudad === 'TODOS' || evento.ciudad === ciudad;

            return coincideTexto && coincideCategoria && coincideCiudad;
        });
    }

    // Verifica si el usuario ya está inscrito en un evento
    estaInscrito(idEvento) {
        return this.#idsInscritosUsuario.has(idEvento);
    }

    obtenerEventosInscritos() {
        return this.#catalogo.filter(evento => this.#idsInscritosUsuario.has(evento.id));
    }

    // Inscribe al usuario aplicando control de duplicados y cupos
    inscribirUsuario(idEvento) {
        if (this.estaInscrito(idEvento)) {
            return { exito: false, mensaje: "Ya estás inscrito en este evento." };
        }

        const evento = this.obtenerPorId(idEvento);
        if (!evento) return { exito: false, mensaje: "Evento no encontrado." };

        if (evento.estado !== 'DISPONIBLE') {
            return { exito: false, mensaje: `No te puedes inscribir: El evento está ${evento.estado.toLowerCase()}.` };
        }

        if (evento.registrarInscripcion()) {
            this.#idsInscritosUsuario.add(idEvento);
            return { exito: true, mensaje: `¡Inscripción exitosa en ${evento.nombre}!` };
        }

        return { exito: false, mensaje: "No hay cupos disponibles." };
    }

    // Cancela la inscripción en 1 clic y libera el cupo
    cancelarInscripcionUsuario(idEvento) {
        if (!this.estaInscrito(idEvento)) {
            return { exito: false, mensaje: "No estás inscrito en este evento." };
        }

        const evento = this.obtenerPorId(idEvento);
        if (evento && evento.cancelarInscripcion()) {
            this.#idsInscritosUsuario.delete(idEvento);
            return { exito: true, mensaje: `Has cancelado tu inscripción a ${evento.nombre}. Cupo liberado.` };
        }

        return { exito: false, mensaje: "Hubo un error al intentar cancelar la inscripción." };
    }
}

/* ==========================================================================
   PASO 4: INTERACTIVIDAD DEL DOM, GESTIÓN SPA Y MODO OSCURO
   ========================================================================== */

// 1. Instanciar el gestor global e inicializar los datos
const gestor = new GestorEventos();
gestor.inicializarDatos();

// Variables globales para almacenar IDs temporales en las modales
let idEventoSeleccionado = null;
let idEventoACancelar = null;

// Instancias nativas de modales y toasts de Bootstrap
let modalDetalleBootstrap;
let modalCancelacionBootstrap;
let toastBootstrap;

// 2. Evento DOMContentLoaded: Se ejecuta en cuanto el HTML carga en el navegador
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes de Bootstrap
    modalDetalleBootstrap = new bootstrap.Modal(document.getElementById('modalDetalleEvento'));
    modalCancelacionBootstrap = new bootstrap.Modal(document.getElementById('modalConfirmarCancelacion'));
    toastBootstrap = new bootstrap.Toast(document.getElementById('liveToast'));

    // Renderizado inicial del catálogo completo
    aplicarFiltros();
    actualizarContadorMisEventos();

    // Configurar todos los event listeners de la interfaz
    configurarEventosNavegacion();
    configurarEventosFiltros();
    configurarAlternadorTema();
    configurarAccionesModales();
});

/* ==========================================================================
   SISTEMA DE TEMA CLARO / OSCURO
   ========================================================================== */
function configurarAlternadorTema() {
    const btnTheme = document.getElementById('btn-theme-toggle');
    const htmlElement = document.documentElement; // Etiqueta <html>

    btnTheme.addEventListener('click', () => {
        const temaActual = htmlElement.getAttribute('data-bs-theme');
        const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
        
        // Aplicar el nuevo tema al HTML
        htmlElement.setAttribute('data-bs-theme', nuevoTema);

        // Cambiar el ícono del botón
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

/* ==========================================================================
   NAVEGACIÓN DINÁMICA (SPA - SIN RECARGAR LA PÁGINA)
   ========================================================================== */
function configurarEventosNavegacion() {
    const btnCatalogo = document.getElementById('btn-tab-catalogo');
    const btnMisEventos = document.getElementById('btn-tab-mis-eventos');
    const btnVolver = document.getElementById('btn-volver-catalogo');

    const seccionCatalogo = document.getElementById('seccion-catalogo');
    const seccionMisEventos = document.getElementById('seccion-mis-eventos');

    const mostrarCatalogo = () => {
        seccionCatalogo.classList.remove('d-none');
        seccionMisEventos.classList.add('d-none');
        btnCatalogo.classList.add('active');
        btnMisEventos.classList.remove('active');
        aplicarFiltros(); // Refrescar para actualizar botones de estado
    };

    const mostrarMisEventos = () => {
        seccionCatalogo.classList.add('d-none');
        seccionMisEventos.classList.remove('d-none');
        btnCatalogo.classList.remove('active');
        btnMisEventos.classList.add('active');
        renderizarMisEventos();
    };

    btnCatalogo.addEventListener('click', mostrarCatalogo);
    btnVolver.addEventListener('click', mostrarCatalogo);
    btnMisEventos.addEventListener('click', mostrarMisEventos);
}

/* ==========================================================================
   FILTROS Y BÚSQUEDA PREDICTIVA EN TIEMPO REAL
   ========================================================================== */
function configurarEventosFiltros() {
    const inputBusqueda = document.getElementById('input-busqueda');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroCiudad = document.getElementById('filtro-ciudad');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');

    // Escuchar cambios en tiempo real en los tres controles
    inputBusqueda.addEventListener('input', aplicarFiltros);
    filtroCategoria.addEventListener('change', aplicarFiltros);
    filtroCiudad.addEventListener('change', aplicarFiltros);

    btnLimpiar.addEventListener('click', () => {
        inputBusqueda.value = '';
        filtroCategoria.value = 'TODOS';
        filtroCiudad.value = 'TODOS';
        aplicarFiltros();
    });
}

function aplicarFiltros() {
    const texto = document.getElementById('input-busqueda').value;
    const categoria = document.getElementById('filtro-categoria').value;
    const ciudad = document.getElementById('filtro-ciudad').value;

    const eventosFiltrados = gestor.filtrarEventos(texto, categoria, ciudad);
    renderizarCatalogo(eventosFiltrados);
}

/* ==========================================================================
   RENDERIZADO DE TARJETAS (CATÁLOGO Y MIS EVENTOS)
   ========================================================================== */
function renderizarCatalogo(eventos) {
    const contenedor = document.getElementById('contenedor-eventos');
    const textoResultados = document.getElementById('texto-resultados');
    
    textoResultados.textContent = `${eventos.length} evento(s) encontrado(s)`;
    contenedor.innerHTML = '';

    if (eventos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-4 text-muted"></i>
                <p class="mt-3 text-muted">No encontramos eventos que coincidan con tus filtros.</p>
            </div>
        `;
        return;
    }

    eventos.forEach(evento => {
        const estaInscrito = gestor.estaInscrito(evento.id);
        
        // Asignación de clase visual al Badge según estado
        let claseBadge = 'badge-disponible';
        if (evento.estado === 'LLENO') claseBadge = 'badge-lleno';
        if (evento.estado === 'FINALIZADO') claseBadge = 'badge-finalizado';

        // Lógica de deshabilitación y prevención de duplicados en el botón principal
        let botonAccionHTML = `<button class="btn btn-outline-secondary btn-accion-tarjeta" onclick="abrirModalDetalle(${evento.id})">Ver detalle →</button>`;
        if (estaInscrito) {
            botonAccionHTML = `<button class="btn btn-secondary btn-accion-tarjeta opacity-75" disabled><i class="bi bi-check-circle-fill me-1"></i> Ya estás inscrito</button>`;
        }

        const tarjetaHTML = `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="card-evento">
                    <div class="placeholder-img-wireframe">
                        <div class="icono-placeholder"></div>
                        <span class="font-monospace text-uppercase small">${evento.categoria} · ${evento.ciudad}</span>
                    </div>
                    <div class="p-3 d-flex flex-column flex-grow-1 gap-2">
                        <div class="d-flex justify-content-between align-items-start gap-2">
                            <h3 class="h6 fw-bold mb-0 text-truncate-2">${evento.nombre}</h3>
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
                        <div class="pt-2">
                            ${botonAccionHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', tarjetaHTML);
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
                <p class="text-muted small">Explora nuestro catálogo y regístrate en las mejores exhibiciones del país.</p>
            </div>
        `;
        return;
    }

    eventosInscritos.forEach(evento => {
        const tarjetaHTML = `
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
                            <button class="btn btn-sm btn-outline-danger" onclick="prepararCancelacion(${evento.id})">
                                <i class="bi bi-x-circle me-1"></i> Cancelar inscripción
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', tarjetaHTML);
    });
}

/* ==========================================================================
   GESTIÓN DE MODALES E ACCIONES DE INSCRIPCIÓN / CANCELACIÓN
   ========================================================================== */
function abrirModalDetalle(idEvento) {
    const evento = gestor.obtenerPorId(idEvento);
    if (!evento) return;

    idEventoSeleccionado = evento.id;
    
    document.getElementById('modal-titulo').textContent = evento.nombre;
    
    // El cuerpo del modal integra el polimorfismo del objeto
    document.getElementById('modal-cuerpo').innerHTML = `
        <div class="mb-3">
            <span class="badge badge-categoria me-2">${evento.categoria}</span>
            <span class="badge bg-secondary">${evento.ciudad}</span>
        </div>
        <div class="mb-3">
            ${evento.obtenerDetallesEspeciales()}
        </div>
        <ul class="list-group list-group-flush small">
            <li class="list-group-item d-flex justify-content-between">
                <strong><i class="bi bi-calendar-event me-2"></i>Fecha:</strong> <span>${evento.fecha}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
                <strong><i class="bi bi-people me-2"></i>Estado de cupos:</strong> 
                <span>${evento.inscritosActuales} / ${evento.aforoMaximo} inscritos</span>
            </li>
        </ul>
    `;

    const pieModal = document.getElementById('modal-pie');
    const estaInscrito = gestor.estaInscrito(evento.id);

    if (estaInscrito) {
        pieModal.innerHTML = `<button type="button" class="btn btn-secondary w-100 opacity-75" disabled>Ya estás inscrito en este evento</button>`;
    } else if (evento.estado !== 'DISPONIBLE') {
        pieModal.innerHTML = `<button type="button" class="btn btn-secondary w-100 opacity-75" disabled>Evento ${evento.estado.toLowerCase()}</button>`;
    } else {
        // Flujo optimizado: Inscripción en solo 2 clics (Clic en "Ver detalle" -> Clic aquí)
        pieModal.innerHTML = `
            <button type="button" class="btn btn-primary w-100 fw-bold" id="btn-procesar-inscripcion">
                Inscribirme al evento
            </button>
        `;
        
        document.getElementById('btn-procesar-inscripcion').addEventListener('click', () => {
            const resultado = gestor.inscribirUsuario(idEventoSeleccionado);
            if (resultado.exito) {
                modalDetalleBootstrap.hide();
                mostrarToast(resultado.mensaje, 'exito');
                actualizarContadorMisEventos();
                aplicarFiltros(); // Refresca las tarjetas en tiempo real sin recargar
            } else {
                mostrarToast(resultado.mensaje, 'error');
            }
        });
    }

    modalDetalleBootstrap.show();
}

function prepararCancelacion(idEvento) {
    idEventoACancelar = idEvento;
    modalCancelacionBootstrap.show(); // Alerta de doble verificación para evitar clics accidentales
}

function configurarAccionesModales() {
    document.getElementById('btn-confirmar-revocacion').addEventListener('click', () => {
        if (idEventoACancelar !== null) {
            const resultado = gestor.cancelarInscripcionUsuario(idEventoACancelar);
            modalCancelacionBootstrap.hide();
            
            if (resultado.exito) {
                mostrarToast(resultado.mensaje, 'advertencia'); // Feedback inmediato
                actualizarContadorMisEventos();
                renderizarMisEventos(); // Actualiza la vista de mis eventos
            } else {
                mostrarToast(resultado.mensaje, 'error');
            }
        }
    });
}

/* ==========================================================================
   UTILIDADES: TOASTS DE RETROALIMENTACIÓN Y CONTADORES
   ========================================================================== */
function mostrarToast(mensaje, tipo = 'exito') {
    const toastBody = document.getElementById('toast-mensaje');
    const toastElement = document.getElementById('liveToast');
    
    // Limpiar clases previas
    toastElement.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');

    if (tipo === 'exito') {
        toastElement.classList.add('text-bg-success'); // Verde para éxito
        toastBody.innerHTML = `<i class="bi bi-check-circle-fill fs-5 me-2"></i> <span>${mensaje}</span>`;
    } else if (tipo === 'advertencia') {
        toastElement.classList.add('text-bg-warning'); // Ámbar/Rojo para alertas
        toastBody.innerHTML = `<i class="bi bi-exclamation-triangle-fill fs-5 me-2"></i> <span>${mensaje}</span>`;
    } else {
        toastElement.classList.add('text-bg-danger');
        toastBody.innerHTML = `<i class="bi bi-x-circle-fill fs-5 me-2"></i> <span>${mensaje}</span>`;
    }

    toastBootstrap.show();
}

function actualizarContadorMisEventos() {
    const contador = document.getElementById('contador-mis-eventos');
    const totalInscritos = gestor.obtenerEventosInscritos().length;
    contador.textContent = totalInscritos;
}