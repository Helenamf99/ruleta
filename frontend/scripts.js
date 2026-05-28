
const modalRanking = document.getElementById("rankingModal");
const btnOpenRanking = document.getElementById("openRanking");
const btnCloseRanking = document.querySelector(".close-modal");


if (btnOpenRanking && modalRanking) {
    btnOpenRanking.addEventListener("click", function(event) {
        event.preventDefault(); 
        buscarTopJugadores(); 
        modalRanking.style.display = "flex"; 
    });
}

if (btnCloseRanking && modalRanking) {
    btnCloseRanking.addEventListener("click", function() {
        modalRanking.style.display = "none";
    });
}

const API_BASE_URL = 'https://volta-juego-abp.loca.lt';
const API_LOGIN_URL = `${API_BASE_URL}/login`;       
const API_REGISTRO_URL = `${API_BASE_URL}/registro`; 

const modalAuth = document.getElementById('modal-auth');
const btnAbrirModalAuth = document.getElementById('btn-abrir-modal');
const btnCerrarAuth = document.querySelector('#modal-auth .btn-cerrar');
const authContainer = document.getElementById('auth-container');
const authMensaje = document.getElementById('auth-mensaje');

// 🌟 BLINDADO: Solo añade el evento si el botón de abrir autenticación existe (Index)
if (btnAbrirModalAuth) {
    btnAbrirModalAuth.addEventListener('click', (e) => {
        e.preventDefault();
        if (btnAbrirModalAuth.getAttribute('data-logged') === 'true') {
            window.location.href = '../voltaGame/juego.html'; 
            return;
        }
        mostrarLogin();
        modalAuth.style.display = "flex"; 
    });
}

if (btnCerrarAuth) {
    btnCerrarAuth.addEventListener('click', () => cerrarModalAuth());
}

window.addEventListener('click', function(event) {
    if (event.target === modalRanking) {
        modalRanking.style.display = "none";
    }
});

function cerrarModalAuth() {
    if (modalAuth) modalAuth.style.display = "none";
    ocultarMensaje();
}

function mostrarLogin() {
    ocultarMensaje();
    if (!authContainer) return;
    authContainer.innerHTML = `
        <form id="form-login" class="auth-form">
            <h2>Iniciar Sesión</h2>
            <input type="email" id="login-correo" placeholder="Correo Electrónico" required>
            <input type="password" id="login-password" placeholder="Contraseña" required>
            <button type="submit">Ingresar</button>
            <p><a href="#" id="link-olvido-password" style="font-size: 13px; color: #ffcb05;">¿Olvidaste tu contraseña?</a></p>
            <p>¿No tienes cuenta? <a href="#" id="link-ir-registro">Regístrate aquí</a></p>
        </form>
    `;
    document.getElementById('form-login').addEventListener('submit', manejarLogin);
}

function mostrarFormularioOlvido() {
    ocultarMensaje();
    if (!authContainer) return;
    authContainer.innerHTML = `
        <form id="form-olvido" class="auth-form">
            <h2>Recuperar Contraseña</h2>
            <p style="font-size: 14px; margin-bottom: 15px; color: #ddd;">Introduce tu correo electrónico para recibir un enlace de recuperación.</p>
            <input type="email" id="olvido-correo" placeholder="Correo Electrónico" required>
            <button type="submit">Enviar Enlace</button>
            <p><a href="#" id="link-volver-login">Volver al Iniciar Sesión</a></p>
        </form>
    `;
    document.getElementById('form-olvido').addEventListener('submit', manejarSolicitudRecuperacion);
}

function mostrarRegistro() {
    ocultarMensaje();
    if (!authContainer) return;
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

if (authContainer) {
    authContainer.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'link-ir-registro') { e.preventDefault(); mostrarRegistro(); }
        if (e.target && e.target.id === 'link-ir-login') { e.preventDefault(); mostrarLogin(); }
        if (e.target && e.target.id === 'link-olvido-password') { e.preventDefault(); mostrarFormularioOlvido(); }
        if (e.target && e.target.id === 'link-volver-login') { e.preventDefault(); mostrarLogin(); }
    });
}

function lanzarMensaje(texto, tipo) {
    if (!authMensaje) return;
    authMensaje.textContent = texto;
    authMensaje.className = `mensaje ${tipo}`; 
    authMensaje.style.display = "block";
}

// 🌟 Modificado para que limpie de forma segura cualquier contenedor de mensajes activo
function ocultarMensaje() {
    const msg = document.getElementById('auth-mensaje');
    if (msg) msg.style.display = "none";
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
            // Guardamos los datos esenciales en el almacenamiento local
            localStorage.setItem('usuarioId', datos.id);
            localStorage.setItem('username', datos.username);
            localStorage.setItem('isAdmin', datos.isAdmin); // Guardamos si es admin o no

            // 🚀 DETECTOR DE ROL: Evaluamos si es Administrador o Jugador estándar
            if (datos.isAdmin === true || datos.isAdmin === "true") {
                lanzarMensaje(`¡Bienvenido Administrador ${datos.username}! Accediendo al panel...`, 'exito');
                
                setTimeout(() => { 
                    cerrarModalAuth(); 
                    // Redirige directo a la pantalla de gestión del admin
                    window.location.href = 'admin/admin.html'; 
                }, 1500);

            } else {
                // Comportamiento normal para jugadores estándar
                lanzarMensaje(`¡Bienvenido, ${datos.username}!`, 'exito');
                
                if (btnAbrirModalAuth) {
                    btnAbrirModalAuth.textContent = "¡Iniciar Juego!";
                    btnAbrirModalAuth.setAttribute('data-logged', 'true');
                }
                
                setTimeout(() => { 
                    cerrarModalAuth(); 
                    window.location.href = '../voltaGame/juego.html'; 
                }, 1500);
            }
            
        } else {
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

    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!regexPassword.test(password)) {
        lanzarMensaje("La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula y un carácter especial.", "error");
        return;
    }
    
    try {
        const respuesta = await fetch(API_REGISTRO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreUsuario, email, password }) 
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            lanzarMensaje("¡Registro con éxito! Redirigiendo a Login...", 'exito');
            setTimeout(() => { mostrarLogin(); }, 2000);
        } else {
            lanzarMensaje(datos.mensaje || "Error al registrar el usuario", 'error');
        }
    } catch (error) {
        lanzarMensaje("Error de conexión al registrar usuario", 'error');
    }
} 

async function manejarSolicitudRecuperacion(e) {
    e.preventDefault();
    ocultarMensaje();
    
    const email = document.getElementById('olvido-correo').value;
    
    try {
        const respuesta = await fetch(`${API_BASE_URL}/recuperar-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const datos = await respuesta.json();
        lanzarMensaje(datos.mensaje, 'exito'); 
    } catch (error) {
        lanzarMensaje("Error al conectar con el servidor", 'error');
    }
}


// ==========================================================================
// 4. LÓGICA EXCLUSIVA PARA LA PÁGINA RESTABLECER.HTML
// ==========================================================================
const formRestablecer = document.getElementById('form-restablecer');
if (formRestablecer) {
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    formRestablecer.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const p1 = document.getElementById('pass1').value;
        const p2 = document.getElementById('pass2').value;
        const msgDiv = document.getElementById('auth-mensaje');

        msgDiv.style.display = "none";
        msgDiv.textContent = "";
        msgDiv.className = "mensaje restablecer-mensaje";

        // 1. Validación de coincidencia
        if (p1 !== p2) {
            msgDiv.textContent = "Las contraseñas no coinciden.";
            msgDiv.className = "mensaje error restablecer-mensaje"; 
            msgDiv.style.display = "block";
            return;
        }

        // 2. Validación de fuerza
        const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!regexPassword.test(p1)) {
            msgDiv.textContent = "Debe tener mínimo 8 caracteres, una mayúscula y un carácter especial.";
            msgDiv.className = "mensaje error restablecer-mensaje";
            msgDiv.style.display = "block";
            return;
        }

        // 3. Envío de datos a la API de Java
        try {
            const res = await fetch(`${API_BASE_URL}/restablecer-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, password: p1 })
            });
            
            const data = await res.json();

            if (res.ok) {
                msgDiv.textContent = "Contraseña cambiada exitosamente.";
                msgDiv.className = "mensaje exito restablecer-mensaje"; 
                msgDiv.style.display = "block";
                
                setTimeout(() => { 
                    window.location.href = 'index.html'; 
                }, 2500);
            } else {
                msgDiv.textContent = data.mensaje || "Error al cambiar la contraseña.";
                msgDiv.className = "mensaje error restablecer-mensaje";
                msgDiv.style.display = "block";
            }
        } catch (err) {
            msgDiv.textContent = "Error de conexión con el servidor.";
            msgDiv.className = "mensaje error restablecer-mensaje";
            msgDiv.style.display = "block";
        }
    });
}