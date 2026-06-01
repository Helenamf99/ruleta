if (typeof API_BASE_URL === "undefined") {
  window.API_BASE_URL = "https://limpness-stress-front.ngrok-free.dev";
}

// Esto sirve para manejarte entre las tres pestañas 
function openTab(evt, tabName) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active-content"));
 
  const buttons = document.querySelectorAll(".tabBtn");
  buttons.forEach((btn) => btn.classList.remove("active"));
 
  const tabTarget = document.getElementById(tabName);
  if (tabTarget) tabTarget.classList.add("active-content");
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
 
  if (tabName === "usuarios") cargarUsuarios();
  if (tabName === "rankings") cargarRankings();
  if (tabName === "preguntas") cargarPreguntas();
}
 
async function cargarUsuarios() {
  const tbody = document.getElementById("lista-usuarios");
  if (!tbody) return;
 
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    const usuarios = await respuesta.json();
    tbody.innerHTML = "";
 
    usuarios.forEach((user) => {
      tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td><span id="name-${user.id}">${user.nombreUsuario}</span></td>
                    <td>${user.email || "Sin correo electrónico"}</td>
                    <td>
                        <button onclick="modificarNombre(${user.id})">Modificar</button>
                        <button class="btn-danger" onclick="eliminarUsuario(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Error al cargar usuarios desde la API:", error);
    tbody.innerHTML = `<tr><td colspan="4" style="color:#fe0851; text-align:center;">⚠️ Error: El backend envió datos corruptos (Recursión infinita en JPA)</td></tr>`;
  }
}
 
async function eliminarUsuario(id) {
  if (confirm(`¿Seguro que quieres eliminar de forma permanente al usuario con ID ${id}?`)) {
    try {
      const respuesta = await fetch(`${API_BASE_URL}/eliminar/usuarios/${id}`, {
        method: "DELETE",
        headers: { 
          "ngrok-skip-browser-warning": "true",
          "Authorizated": "1" 
        },
      });
 
    if (respuesta.ok) {
                alert("Usuario eliminado correctamente. Se enviará un correo de notificación.");
                cargarUsuarios();
            }
            if (respuesta.status ===403){
                alert("Petición denegada. No tienes permisos de adminsitrador.");
                return;
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
        cargarUsuarios();
  }
}
 
async function modificarNombre(id) {
  const nuevoNombre = prompt("Introduce el nuevo nombre sustituto:");
  if (!nuevoNombre) return;
 
  try {
    const respuesta = await fetch(`${API_BASE_URL}/usuarios/modificar/${id}`, {
      method: "PUT",
      headers: { 
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ nombreUsuario: nuevoNombre }),
    });
 
    if (respuesta.ok) {
      alert("El nombre de usuario ha sido modificado.");
      cargarUsuarios();
    }
  } catch (error) {
    console.error("Error en la petición PUT:", error);
  }
}
 
 
const tablaUsuariosExiste = document.getElementById("lista-usuarios");
if (tablaUsuariosExiste) {
  cargarUsuarios();
}
 
 
async function cargarRankings() {
  const lista = document.getElementById("lista-rankings");
  if (!lista) return;
 
  try {
    const respuesta = await fetch(`${API_BASE_URL}/ranking`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    const ranking = await respuesta.json();
    lista.innerHTML = "";
 
    if (ranking.length === 0) {
      lista.innerHTML = "<li> Aún no hay partidas registradas en el ranking.</li>";
      return;
    }
 
    ranking.forEach((jugador, index) => {
      const tiempo = jugador.mejorTiempo || "Sin tiempo";
      const puntos = jugador.puntosMaximos != null ? jugador.puntosMaximos : 0;
 
      lista.innerHTML += `
                <li>
                    <strong>#${index + 1}</strong> - ${jugador.nombreUsuario}
                    | Mejor Tiempo: <span style="color: #ffcb05;">${tiempo}</span>
                    | Puntos Máx: <span style="color: #00ffcc;">${puntos} pts</span>
                </li>
            `;
    });
  } catch (error) {
    console.error("Error al cargar el ranking:", error);
    lista.innerHTML = '<li style="color: red;"> Error al conectar con el servidor de rankings.</li>';
  }
}
 
async function cargarPreguntas() {
  const lista = document.getElementById("lista-preguntas");
  if (!lista) return;
 
  try {
    const respuesta = await fetch(`${API_BASE_URL}/preguntas`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    const preguntas = await respuesta.json();
    lista.innerHTML = "";
 
    if (preguntas.length === 0) {
      lista.innerHTML = "<li> El banco de preguntas está vacío en la base de datos.</li>";
      return;
    }
 
 
    preguntas.forEach((pregunta) => {
 
      const textoCorrecto = pregunta.respuestaCorrecta || "No asignada";
     
     
      const letraBadge = pregunta.letra ? pregunta.letra.toUpperCase() : "?";
     
   
      const nombreCategoria = pregunta.categoriaNombre || `Categoría ID: ${pregunta.id_cat || 'General'}`;
 
      lista.innerHTML += `
                <li style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px; list-style: none;">
                    <span style="background: #00ffff; color: #000; padding: 2px 6px; font-weight: bold; border-radius: 3px; font-family: 'Orbitron'; margin-right: 5px;">${letraBadge}</span>
                    <strong>[${nombreCategoria}]</strong> ${pregunta.enunciado} <br>
                    <small style="color: #00ff87; font-weight: bold; display: inline-block; margin-top: 5px;">✓ Respuesta correcta: ${textoCorrecto}</small>
                </li>
            `;
    });
  } catch (error) {
    console.error("Error al cargar las preguntas:", error);
    lista.innerHTML = '<li style="color: red; list-style: none;"> Error al conectar con el banco de preguntas o mapear sus propiedades.</li>';
  }
}