// ==========================================================================
// 1. MODAL DEL RANKING (Configuración)
// ==========================================================================
const modalRanking = document.getElementById("rankingModal");
const btnOpenRanking = document.getElementById("openRanking");
const btnCloseRanking = document.querySelector(".close-modal");

function buscarTopJugadores() {
    // Aquí iría la lógica para obtener los datos reales del ranking desde el backend
}

// Abrir el modal al hacer click en "Ver Ranking" (Corregido sin los paréntesis)
btnOpenRanking.addEventListener("click", function(event) {
    event.preventDefault(); 
    buscarTopJugadores(); // Llama a la función aquí dentro
    modalRanking.style.display = "flex"; 
});

// Cerrar el modal Ranking al hacer click en la (X)
btnCloseRanking.addEventListener("click", function() {
    modalRanking.style.display = "none";
});


// ==========================================================================
// 2. MODAL DE AUTENTICACIÓN (LOGIN / REGISTRO)
// ==========================================================================
const API_LOGIN_URL = 'https://tu-api.com/auth/login';
const API_REGISTRO_URL = 'https://tu-api.com/auth/register';

// Variables renombradas para evitar duplicados fatales
const modalAuth = document.getElementById('modal-auth');
const btnAbrirModalAuth = document.getElementById('btn-abrir-modal');
const btnCerrarAuth = document.querySelector('#modal-auth .btn-cerrar');
const authContainer = document.getElementById('auth-container');
const authMensaje = document.getElementById('auth-mensaje');

// Control de apertura y cierre del Modal Auth
btnAbrirModalAuth.addEventListener('click', (e) => {
    e.preventDefault();
    // Si el botón ya dice "Iniciar Juego" sin trabas (usuario logueado), redirige
    if (btnAbrirModalAuth.getAttribute('data-logged') === 'true') {
        window.location.href = 'juego.html'; 
        return;
    }
    mostrarLogin();
    modalAuth.style.display = "flex"; // Usamos flex igual que en el ranking para mantener coherencia
});

btnCerrarAuth.addEventListener('click', () => cerrarModalAuth());

// Evento global para cerrar CUALQUIER modal haciendo clic fuera de su caja
window.addEventListener('click', function(event) {
    if (event.target === modalRanking) {
        modalRanking.style.display = "none";
    }
    if (event.target === modalAuth) {
        cerrarModalAuth();
    }
});

function cerrarModalAuth() {
    modalAuth.style.display = "none";
    ocultarMensaje();
}

// Renderizado de Formularios Dinámicos
function mostrarLogin() {
    ocultarMensaje();
    authContainer.innerHTML = `
        <form id="form-login" class="auth-form">
            <h2>Iniciar Sesión</h2>
            <input type="email" id="login-correo" placeholder="Correo Electrónico" required>
            <input type="password" id="login-password" placeholder="Contraseña" required>
            <button type="submit">Ingresar</button>
            <p>¿No tienes cuenta? <a href="#" id="link-ir-registro">Regístrate aquí</a></p>
        </form>
    `;
    document.getElementById('link-ir-registro').addEventListener('click', (e) => { e.preventDefault(); mostrarRegistro(); });
    document.getElementById('form-login').addEventListener('submit', manejarLogin);
}

function mostrarRegistro() {
    ocultarMensaje();
    authContainer.innerHTML = `
        <form id="form-registro" class="auth-form">
            <h2>Crear Cuenta</h2>
            <input type="text" id="reg-usuario" placeholder="Nombre de Usuario" required>
            <input type="email" id="reg-correo" placeholder="Correo Electrónico" required>
            <input type="password" id="reg-password" placeholder="Contraseña" required>
            <button type="submit">Registrarse</button>
            <p>¿Ya tienes cuenta? <a href="#" id="link-ir-login">Inicia sesión</a></p>
        </form>
    `;
    document.getElementById('link-ir-login').addEventListener('click', (e) => { e.preventDefault(); mostrarLogin(); });
    document.getElementById('form-registro').addEventListener('submit', manejarRegistro);
}

// Manejo de Mensajes de feedback
function lanzarMensaje(texto, tipo) {
    authMensaje.textContent = texto;
    authMensaje.className = `mensaje ${tipo}`; 
    authMensaje.style.display = "block";
}
function ocultarMensaje() {
    authMensaje.style.display = "none";
}

// Peticiones a la API
async function manejarLogin(e) {
    e.preventDefault();
    ocultarMensaje();
    
    const email = document.getElementById('login-correo').value;
    const password = document.getElementById('login-password').value;

    try {
        const respuesta = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            lanzarMensaje(`¡Bienvenido, ${datos.username}!`, 'exito');
            btnAbrirModalAuth.textContent = "¡Iniciar Juego!";
            btnAbrirModalAuth.setAttribute('data-logged', 'true');
            setTimeout(() => { cerrarModalAuth(); }, 1500);
        } else {
            lanzarMensaje("Usuario no encontrado o datos incorrectos", 'error');
        }
    } catch (error) {
        lanzarMensaje("Error al conectar con el servidor", 'error');
    }
}

async function manejarRegistro(e) {
    e.preventDefault();
    ocultarMensaje();

    const username = document.getElementById('reg-usuario').value;
    const email = document.getElementById('reg-correo').value;
    const password = document.getElementById('reg-password').value;
    
    try {
        const respuesta = await fetch(API_REGISTRO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (respuesta.ok) {
            lanzarMensaje("¡Registro con éxito! Redirigiendo a Login...", 'exito');
            setTimeout(() => { mostrarLogin(); }, 2000);
        } else {
            lanzarMensaje("Error: Dato incorrecto o correo ya registrado", 'error');
        }
    } catch (error) {
        lanzarMensaje("Error de conexión al registrar usuario", 'error');
    }
}j