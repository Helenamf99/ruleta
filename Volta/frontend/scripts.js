// ==========================================================================
// 1. MODAL DEL RANKING (Configuración)
// ==========================================================================
const modalRanking = document.getElementById("rankingModal");
const btnOpenRanking = document.getElementById("openRanking");
const btnCloseRanking = document.querySelector(".close-modal");

function buscarTopJugadores() {
    // Aquí iría la lógica para obtener los datos reales del ranking desde el backend
}

// Abrir el modal al hacer click en "Ver Ranking"
btnOpenRanking.addEventListener("click", function(event) {
    event.preventDefault(); 
    buscarTopJugadores(); 
    modalRanking.style.display = "flex"; 
});

// Cerrar el modal Ranking al hacer click en la (X)
btnCloseRanking.addEventListener("click", function() {
    modalRanking.style.display = "none";
});


// ==========================================================================
// 2. MODAL DE AUTENTICACIÓN (LOGIN / REGISTRO) - CONECTADO A TU API LOCAL
// ==========================================================================
const API_BASE_URL = 'http://localhost:8081';
const API_LOGIN_URL = `${API_BASE_URL}/login`;       // Apunta a tu @PostMapping("/login")
const API_REGISTRO_URL = `${API_BASE_URL}/registro`; // Apunta a tu @PostMapping("/registro")

// Variables del DOM
const modalAuth = document.getElementById('modal-auth');
const btnAbrirModalAuth = document.getElementById('btn-abrir-modal');
const btnCerrarAuth = document.querySelector('#modal-auth .btn-cerrar');
const authContainer = document.getElementById('auth-container');
const authMensaje = document.getElementById('auth-mensaje');

// Control de apertura y cierre del Modal Auth
btnAbrirModalAuth.addEventListener('click', (e) => {
    e.preventDefault();
    if (btnAbrirModalAuth.getAttribute('data-logged') === 'true') {
        window.location.href = '../voltaGame/juego.html'; 
        return;
    }
    mostrarLogin();
    modalAuth.style.display = "flex"; 
});

btnCerrarAuth.addEventListener('click', () => cerrarModalAuth());

// Evento global para cerrar CUALQUIER modal haciendo clic fuera de su caja
window.addEventListener('click', function(event) {
    if (event.target === modalRanking) {
        modalRanking.style.display = "none";
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
    document.getElementById('form-registro').addEventListener('submit', manejarRegistro);
}

// 🌟 Delegación de eventos para los enlaces dinámicos (Ir a registro / Ir a login)
authContainer.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'link-ir-registro') {
        e.preventDefault();
        mostrarRegistro();
    }
    if (e.target && e.target.id === 'link-ir-login') {
        e.preventDefault();
        mostrarLogin();
    }
});

// Manejo de Mensajes de feedback
function lanzarMensaje(texto, tipo) {
    authMensaje.textContent = texto;
    authMensaje.className = `mensaje ${tipo}`; 
    authMensaje.style.display = "block";
}
function ocultarMensaje() {
    authMensaje.style.display = "none";
}

// ==========================================================================
// 3. ENTRADA Y SALIDA DE DATOS REALES CON TU BACKEND (FETCH)
// ==========================================================================
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
            
            // Guardamos la sesión en el navegador
            localStorage.setItem('usuarioId', datos.id);
            localStorage.setItem('username', datos.username);
            
            btnAbrirModalAuth.textContent = "¡Iniciar Juego!";
            btnAbrirModalAuth.setAttribute('data-logged', 'true');
            
            // 🌟 MODIFICACIÓN AQUÍ: Espera 1.5 segundos para leer el éxito y salta solo
            setTimeout(() => { 
                cerrarModalAuth(); 
                window.location.href = '../voltaGame/juego.html'; // <-- Esta línea hace la magia
            }, 1500);
            
        } else {
            // Muestra el mensaje de error que viene directo de tu JuegoController
            lanzarMensaje(datos.mensaje || "Credenciales incorrectas", 'error');
        }
    } catch (error) {
        lanzarMensaje("Error al conectar con el servidor", 'error');
    }
}
async function manejarRegistro(e) {
    e.preventDefault();
    ocultarMensaje();

    const nombreUsuario = document.getElementById('reg-usuario').value;
    const email = document.getElementById('reg-correo').value;
    const password = document.getElementById('reg-password').value;

    // 🌟 Expresión regular para validar fortaleza de contraseña en el cliente antes de ir a la API
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!regexPassword.test(password)) {
        lanzarMensaje("La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula y un carácter especial.", "error");
        return;
    }
    
    try {
        const respuesta = await fetch(API_REGISTRO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreUsuario, email, password }) // Mapeado exacto con tu DTO Java
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            lanzarMensaje("¡Registro con éxito! Redirigiendo a Login...", 'exito');
            setTimeout(() => { mostrarLogin(); }, 2000);
        } else {
            // Muestra "Ese nombre de usuario ya existe" o el correo duplicado que manda el Service
            lanzarMensaje(datos.mensaje || "Error al registrar el usuario", 'error');
        }
    } catch (error) {
        lanzarMensaje("Error de conexión al registrar usuario", 'error');
    }
}