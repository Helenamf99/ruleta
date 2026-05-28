// ==========================================================================
// 1. CONFIGURACIÓN Y ESTADO GLOBAL DEL JUEGO
// ==========================================================================
const API_BASE_URL = "https://volta-juego-abp.loca.lt";
const ROSETTA_LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXY Z"
  .replace(" ", "")
  .split("");
let estadoRosco = {};
let indiceLetraActual = 0;
let segundaVueltaActiva = false;

// Relojes y contadores globales
let tiempoTotalSegundos = 0;
let cronometroGlobal;
let relojPregunta;
let tiempoPreguntaRestante = 15;

const listaOpcionesRuleta = [
  "GEOGRAFÍA",
  "INFORMÁTICA",
  "HISTORIA",
  "MÚSICA",
  "ENTRETENIMIENTO",
  "DEPORTES",
  "COMODIN_MAS",
  "COMODIN_MENOS",
];
let gradosAcumulados = 0;

// Elementos del DOM (Modales Independientes)
const modalSistema = document.getElementById("modal-sistema");
const modalRuleta = document.getElementById("modal-ruleta");
const modalPregunta = document.getElementById("modal-pregunta");

const sistemaDinamico = document.getElementById("sistema-dinamico");
const preguntaDinamica = document.getElementById("pregunta-dinamica");
const ruletaDisco = document.getElementById("ruleta-neon");
const btnGirarRuleta = document.getElementById("btn-girar-ruleta");
const ruletaLetraTitulo = document.getElementById("ruleta-letra-titulo");

const roscoElement = document.getElementById("rosco");
const gameClockElement = document.getElementById("game-clock");

// ==========================================================================
// 2. INICIALIZACIÓN: RENDERIZAR EL ROSCO EN CÍRCULO PERFECTO
// ==========================================================================
function inicializarRosco() {
  roscoElement.innerHTML = "";
  const totalLetras = ROSETTA_LETTERS.length;
  const radio = 290;
  const centroX = centerCoordOffset(650); // Centrado de caja relativo
  const centroY = centerCoordOffset(650);

  function centerCoordOffset(boxSize) {
    return boxSize / 2 - 27.5;
  }

  ROSETTA_LETTERS.forEach((letra, index) => {
    estadoRosco[letra] = "bloqueado";

    const div = document.createElement("div");
    div.innerText = letra;
    div.id = `letra-${letra}`;
    div.classList.add("letra-rosco");

    // Trigonometría para posicionar en círculo iniciando arriba en la 'A'
    const angulo = (index / totalLetras) * 2 * Math.PI - Math.PI / 2;
    const x = centroX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    div.addEventListener("click", () => {
      if (estadoRosco[letra] === "activa") {
        abrirRuletaCategoria(letra);
      }
    });

    roscoElement.appendChild(div);
  });

  actualizarLetraActiva("A");
}

function actualizarLetraActiva(letra) {
  // Apaga el estado activo de la letra vieja en el diccionario de datos
  Object.keys(estadoRosco).forEach((key) => {
    if (estadoRosco[key] === "activa") estadoRosco[key] = "bloqueado";
  });

  estadoRosco[letra] = "activa";

  // Sincroniza clases CSS de todo el rosco
  ROSETTA_LETTERS.forEach((l) => {
    const el = document.getElementById(`letra-${l}`);
    if (!el) return;

    if (
      l === letra &&
      (estadoRosco[l] === "activa" || estadoRosco[l] === "bloqueado")
    ) {
      el.className = "letra-rosco activa";
    } else if (estadoRosco[l] === "correcto") {
      el.className = "letra-rosco correcta";
    } else if (estadoRosco[l] === "incorrecto") {
      el.className = "letra-rosco incorrecta";
    } else if (estadoRosco[l] === "volta") {
      el.className = "letra-rosco volta";
    } else {
      el.className = "letra-rosco";
    }
  });
}

function letraActual() {
  return ROSETTA_LETTERS[indiceLetraActual];
}

// ==========================================================================
// 3. FLUJO DE BIENVENIDA Y CUENTA ATRÁS
// ==========================================================================
function modalBienvenida() {
  modalSistema.style.display = "flex";
  sistemaDinamico.innerHTML = `
        <h2>¡Bienvenido a Volta!</h2>
        <p style="margin: 20px 0;">¿Estás listo para poner a prueba tu sabiduría con el rosco definitivo?</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="btn-start-game" class="btn-game-neon" style="background:#00ff87; color:#000;">Empezar Juego</button>
            <button id="btn-cancel-game" class="btn-game-neon" style="background:#fe0851; color:#fff;">Cancelar</button>
        </div>
    `;
  document.getElementById("btn-start-game").addEventListener("click", () => {
    modalSistema.style.display = "none";
    iniciarCuentaAtras();
  });
  document.getElementById("btn-cancel-game").addEventListener("click", () => {
    window.location.href = "../frontend/index.html";
  });
}

function iniciarCuentaAtras() {
  const countdownScreen = document.getElementById("countdown-screen");
  countdownScreen.style.display = "flex";
  let cuenta = 3;
  countdownScreen.innerText = cuenta;

  const intervalo = setInterval(() => {
    cuenta--;
    if (cuenta > 0) {
      countdownScreen.innerText = cuenta;
    } else {
      clearInterval(intervalo);
      countdownScreen.style.display = "none";
      arrancarCronometroGlobal();
    }
  }, 1000);
}

function arrancarCronometroGlobal() {
  cronometroGlobal = setInterval(() => {
    tiempoTotalSegundos++;
    const minutos = String(Math.floor(tiempoTotalSegundos / 60)).padStart(
      2,
      "0",
    );
    const segundos = String(tiempoTotalSegundos % 60).padStart(2, "0");
    gameClockElement.innerText = `${minutos}:${segundos}`;
  }, 1000);
}

// ==========================================================================
// 4. LÓGICA DE GIRO DE LA RULETA NEÓN Y COMODINES
// ==========================================================================
function abrirRuletaCategoria(letra) {
  document
    .querySelectorAll(".sector")
    .forEach((s) => s.classList.remove("ganador-iluminado"));
  ruletaLetraTitulo.innerText = letra;
  btnGirarRuleta.style.display = "inline-block";
  modalRuleta.style.display = "flex";
}

btnGirarRuleta.addEventListener("click", () => {
  btnGirarRuleta.style.display = "none";

  const indiceGanador = Math.floor(Math.random() * listaOpcionesRuleta.length);
  const opcionFinal = listaOpcionesRuleta[indiceGanador];

  const anguloPorSector = 45;
  const compensacionGiro = 360 - indiceGanador * anguloPorSector;
  gradosAcumulados += 360 * 5 + compensacionGiro - (gradosAcumulados % 360);

  ruletaDisco.style.transform = `rotate(${gradosAcumulados}deg)`;

  setTimeout(() => {
    const sectores = document.querySelectorAll(".sector");
    sectores[indiceGanador].classList.add("ganador-iluminado");

    setTimeout(() => {
      modalRuleta.style.display = "none";
      evaluarResultadoRuleta(letraActual(), opcionFinal);
    }, 1200);
  }, 4000);
});

function evaluarResultadoRuleta(letra, resultado) {
  if (resultado === "COMODIN_MAS") {
    tiempoTotalSegundos += 15;
    mostrarModalComodin(
      letra,
      "¡COMODÍN MALO! +15 Segundos añadidos al cronómetro global.",
      "#fe0851",
    );
    abrirRuletaCategoria(letra);
  } else if (resultado === "COMODIN_MENOS") {
    tiempoTotalSegundos = Math.max(0, tiempoTotalSegundos - 15);
    mostrarModalComodin(
      letra,
      "¡COMODÍN BUENO! -15 Segundos rebajados del cronómetro global.",
      "#00ff87",
    );
    abrirRuletaCategoria(letra);
  } else {
    cargarPreguntaAPI(letra, resultado);
  }
}

function mostrarModalComodin(letra, mensaje, colorTexto) {
  modalPregunta.style.display = "flex";
  preguntaDinamica.innerHTML = `
        <h3 style="color:${colorTexto};">Efecto Comodín</h3>
        <p style="margin: 25px 0; font-size: 1.2rem;">${mensaje}</p>
        <button id="btn-continuar-comodin" class="btn-game-neon">Continuar Rosco</button>
    `;

  document
    .getElementById("btn-continuar-comodin")
    .addEventListener("click", () => {
      modalPregunta.style.display = "none";
      abrirRuletaCategoria(letra);
    });
}

// ==========================================================================
// 5. CARGAR PREGUNTA REAL DESDE LA API Y RENDERIZADO DINÁMICO DE MODALES
// ==========================================================================

// 🌟 DICCIONARIO DE EQUIVALENCIAS: Traduce el sector de la ruleta al ID de tu MySQL
const MAPA_CATEGORIAS_BD = {
  "GEOGRAFÍA": 1,
  "HISTORIA": 2,
  "MÚSICA": 3,
  "INFORMÁTICA": 4,
  "ENTRETENIMIENTO": 5,
  "DEPORTES": 6
};

async function cargarPreguntaAPI(letra, categoriaRuleta) {
  try {
    // 1. Convertimos el nombre de la ruleta al ID numérico que espera tu Java
    const categoriaId = MAPA_CATEGORIAS_BD[categoriaRuleta] || 1;

    // 2. Apuntamos al endpoint pasando el Query Param
    const url = `${API_BASE_URL}/preguntas?categoriaId=${categoriaId}`;

    // 3. Realizamos la petición HTTP
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("Error al comunicarse con el servidor");

    const listaPreguntas = await respuesta.json();

    // 4. FILTRAR: Comparamos de forma limpia la 'letra' con la del rosco
    const preguntasFiltradas = listaPreguntas.filter((p) => {
      if (!p || !p.letra || !p.enunciado) return false;
      return p.letra.trim().toUpperCase() === letra.toUpperCase();
    });

    // 5. VALIDACIÓN / FALLBACK: De emergencia si no hay preguntas mapeadas
    let preguntaFinal;
    if (preguntasFiltradas.length === 0) {
      console.warn(`No hay preguntas en BD para la letra ${letra} en ${categoriaRuleta}. Usando fallback.`);
      preguntaFinal = {
        pregunta: `No hay preguntas registradas en la categoría ${categoriaRuleta} para la letra ${letra}. ¿Cuál es el puerto de Spring Boot?`,
        opciones: ["8080", "3306", "80", "443"],
        correcta: "8080"
      };
    } else {
      const seleccionada = preguntasFiltradas[Math.floor(Math.random() * preguntasFiltradas.length)];
      preguntaFinal = {
        pregunta: seleccionada.enunciado,
        opciones: seleccionada.opciones,
        correcta: seleccionada.respuestaCorrecta
      };
    }

    // 6. DETENER EL TIEMPO DE PREGUNTAS ANTERIORES POR SEGURIDAD
    if (relojPregunta) clearInterval(relojPregunta);
    tiempoPreguntaRestante = 15;

    // 7. PINTAR EL MODAL CON ESTILOS INTEGRADOS NEÓN Y EL RELOJ DE PREGUNTA RESTAURADO
    modalPregunta.style.display = "flex";
    
    const opcionesMezcladas = [...preguntaFinal.opciones].sort(() => Math.random() - 0.5);

    preguntaDinamica.innerHTML = `
        <div class="pregunta-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #00ffff; padding-bottom:10px; margin-bottom:15px;">
            <span class="letra-indicador" style="font-size:2rem; font-family:'Orbitron', sans-serif; color:#00ffff; font-weight:bold;">${letra.toUpperCase()}</span>
            <span id="reloj-pregunta-modal" style="font-size:1.5rem; font-family:'Orbitron', sans-serif; color:#ff0055; border:1px solid #ff0055; padding:2px 10px; border-radius:5px; box-shadow:0 0 8px #ff0055;">00:15</span>
        </div>
        <h4 style="color:#aaa; text-transform:uppercase; letter-spacing:2px; font-size:0.9rem; margin-bottom:5px;">Categoría: ${categoriaRuleta}</h4>
        <p class="texto-pregunta" style="font-size:1.2rem; line-height:1.5; margin-bottom:25px; min-height:60px;">${preguntaFinal.pregunta}</p>
        
        <div class="grid-respuestas" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:20px;">
            ${opcionesMezcladas.map(opc => `
                <button class="btn-game-neon btn-opcion-juego" 
                        style="background:rgba(255,255,255,0.05); color:#fff; border:1px solid #00ffff; padding:12px; border-radius:8px; cursor:pointer; font-family:'Orbitron', sans-serif; font-size:1rem; transition:all 0.2s; box-shadow:0 0 5px rgba(0,255,255,0.2);"
                        onclick="manejarClickRespuesta(this, '${letra}', '${opc.replace(/'/g, "\\'")}', '${preguntaFinal.correcta.replace(/'/g, "\\'")}')">${opc}</button>
            `).join('')}
        </div>
        
        <button class="btn-game-neon btn-volta" 
            style="margin-top:10px; width:100%; background:#ffbc00; color:#000; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-family:'Orbitron', sans-serif; font-size:1rem; box-shadow:0 0 10px #ffbc00;" 
            onclick="manejarClickRespuesta(this, '${letra}', 'VOLTA', '${preguntaFinal.correcta.replace(/'/g, "\\'")}')">💥 PASAPALABRA (VOLTA)</button>
    `;

    // 8. ACTIVAR EL TEMPORIZADOR VISUAL DE LA PREGUNTA
    const elementoRelojModal = document.getElementById("reloj-pregunta-modal");
    relojPregunta = setInterval(() => {
        tiempoPreguntaRestante--;
        elementoRelojModal.innerText = `00:${String(tiempoPreguntaRestante).padStart(2, "0")}`;
        
        if (tiempoPreguntaRestante <= 0) {
            clearInterval(relojPregunta);
            modalPregunta.style.display = "none";
            evaluarRespuesta(letra, "", preguntaFinal.correcta, true); // Tiempo agotado
        }
    }, 1000);

  } catch (error) {
    console.error("Error crítico al recuperar datos del backend:", error);
    modalPregunta.style.display = "flex";
    preguntaDinamica.innerHTML = `
        <h3 style="color:#fe0851;">⚠️ Error de Conexión</h3>
        <p style="margin:20px 0;">No se pudo conectar con el servidor.</p>
        <button onclick="modalPregunta.style.display='none'; abrirRuletaCategoria('${letra}');" class="btn-game-neon">Reintentar Giro</button>
    `;
  }
}

// 🌟 NUEVA FUNCIÓN INTERACTIVA: Controla luces de acierto/fallo y frena el reloj
window.manejarClickRespuesta = function(botonPulsado, letra, respuestaUsuario, respuestaCorrecta) {
    // Paramos el reloj de la pregunta inmediatamente para que no siga corriendo
    if (relojPregunta) clearInterval(relojPregunta);

    // Desactivamos todos los botones de opciones para evitar multiclics accidentales
    const todosLosBotones = document.querySelectorAll(".btn-opcion-juego, .btn-volta");
    todosLosBotones.forEach(btn => btn.disabled = true);

    if (respuestaUsuario === "VOLTA") {
        // Si es pasapalabra, no hay feedback de color, transiciona directo
        modalPregunta.style.display = "none";
        evaluarRespuesta(letra, respuestaUsuario, respuestaCorrecta, false);
    } else if (respuestaUsuario === respuestaCorrecta) {
        // ¡Acierto! Pintamos de verde brillante con sombra neón
        botonPulsado.style.background = "#00ff87";
        botonPulsado.style.color = "#000";
        botonPulsado.style.borderColor = "#00ff87";
        botonPulsado.style.boxShadow = "0 0 20px #00ff87";
        
        setTimeout(() => {
            modalPregunta.style.display = "none";
            evaluarRespuesta(letra, respuestaUsuario, respuestaCorrecta, false);
        }, 1000); // 1 segundo de pausa para ver el acierto
    } else {
        // ¡Fallo! Pintamos de rojo carmín al botón pulsado
        botonPulsado.style.background = "#fe0851";
        botonPulsado.style.color = "#fff";
        botonPulsado.style.borderColor = "#fe0851";
        botonPulsado.style.boxShadow = "0 0 20px #fe0851";

        // Iluminamos sutilmente en verde cuál era la respuesta que era correcta para ayudar al jugador
        todosLosBotones.forEach(btn => {
            if (btn.innerText === respuestaCorrecta) {
                btn.style.background = "rgba(0, 255, 135, 0.2)";
                btn.style.borderColor = "#00ff87";
            }
        });
        
        setTimeout(() => {
            modalPregunta.style.display = "none";
            evaluarRespuesta(letra, respuestaUsuario, respuestaCorrecta, false);
        }, 1200); // Un pelín más de tiempo para que asimilen la solución
    }
};

// ==========================================================================
// 6. EVALUACIÓN DE RESPUESTAS Y MÁQUINA DE ESTADOS (CAMBIOS DE TURNO)
// ==========================================================================
function evaluarRespuesta(
  letra,
  respuestaUsuario,
  respuestaCorrecta,
  esTiempoAgotado,
) {
  if (esTiempoAgotado) {
    estadoRosco[letra] = "incorrecto";
    actualizarContadoresMarcador("fallo");
  } else if (respuestaUsuario === "VOLTA") {
    estadoRosco[letra] = "volta";
  } else if (respuestaUsuario === respuestaCorrecta) {
    estadoRosco[letra] = "correcto";
    actualizarContadoresMarcador("acierto");
  } else {
    estadoRosco[letra] = "incorrecto";
    actualizarContadoresMarcador("fallo");
  }

  avanzarSiguienteTurno();
}

function actualizarContadoresMarcador(tipo) {
  if (tipo === "acierto") {
    const c = document.getElementById("score-correct");
    if (c) c.innerText = Number(c.innerText) + 1;
  } else {
    const f = document.getElementById("score-incorrect");
    if (f) f.innerText = Number(f.innerText) + 1;
  }
}

function avanzarSiguienteTurno() {
  let encontrado = false;
  let vueltasContadas = 0;

  while (!encontrado && vueltasContadas < 2) {
    indiceLetraActual++;

    if (indiceLetraActual >= ROSETTA_LETTERS.length) {
      indiceLetraActual = 0;
      segundaVueltaActiva = true;
      vueltasContadas++;
    }

    let letraEvaluada = ROSETTA_LETTERS[indiceLetraActual];

    if (!segundaVueltaActiva && estadoRosco[letraEvaluada] === "bloqueado") {
      encontrado = true;
      actualizarLetraActiva(letraEvaluada);
    } else if (segundaVueltaActiva && estadoRosco[letraEvaluada] === "volta") {
      encontrado = true;
      actualizarLetraActiva(letraEvaluada);
    }
  }

  if (!encontrado) {
    finalizarJuego();
  }
}

async function finalizarJuego() {
  clearInterval(cronometroGlobal);
  modalSistema.style.display = "flex";

  const elementAciertos = document.getElementById("score-correct");
  const elementFallos = document.getElementById("score-incorrect");
  const aciertos = elementAciertos ? Number(elementAciertos.innerText) : 0;
  const fallos = elementFallos ? Number(elementFallos.innerText) : 0;
  const tiempoFinalTexto = gameClockElement.innerText;

  const usuarioId = localStorage.getItem('usuarioId') || 1;
  const tiempoFormateadoJava = `00:${tiempoFinalTexto}`;

  sistemaDinamico.innerHTML = `<h2 style="font-family:'Orbitron',sans-serif; text-align:center;">Guardando partida en el servidor... ⏳</h2>`;

  try {
    const URL_FINALIZAR = `${API_BASE_URL}/partidas/finalizar?usuarioId=${usuarioId}&puntos=${aciertos}&tiempo=${tiempoFormateadoJava}`;

    const respuesta = await fetch(URL_FINALIZAR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!respuesta.ok) throw new Error("Error en el guardado");

    sistemaDinamico.innerHTML = `
        <h2 style="font-family:'Monoton', cursive; color:#00ffff; text-align:center; font-size:2.5rem; margin-bottom:10px;">¡FIN DE PARTIDA! 🏁</h2>
        <p style="margin:15px 0; font-size:1.1rem; text-align:center;">Historial registrado correctamente en vuestro clúster.</p>
        <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:10px; border:1px solid rgba(0,255,255,0.2); max-width:400px; margin:0 auto;">
            <p style="margin:8px 0;"><b>⏱️ Tiempo empleado:</b> <span style="color:#ffff00; font-family:'Orbitron';">${tiempoFinalTexto}</span></p>
            <p style="margin:8px 0;"><b>✅ Respuestas acertadas:</b> <span style="color:#00ff87; font-family:'Orbitron';">${aciertos} pts</span></p>
            <p style="margin:8px 0;"><b>❌ Errores cometidos:</b> <span style="color:#fe0851; font-family:'Orbitron';">${fallos}</span></p>
        </div>
        <button onclick="window.location.href='index.html'" class="btn-game-neon" style="margin-top:25px; width:100%; background:#00ff87; color:#000; font-weight:bold; padding:12px; border-radius:8px;">Volver al Menú Principal</button>
    `;

  } catch (error) {
    console.error("Error al guardar partida:", error);
    sistemaDinamico.innerHTML = `
        <h2 style="font-family:'Orbitron',sans-serif; color:#fe0851;">Rosco Finalizado</h2>
        <p style="color:#ffcc00; margin:15px 0;">⚠️ Partida offline: No se pudo conectar con el backend para actualizar el ranking.</p>
        <p><b>Aciertos:</b> ${aciertos} | <b>Tiempo:</b> ${tiempoFinalTexto}</p>
        <button onclick="window.location.href='index.html'" class="btn-game-neon" style="margin-top:20px; width:100%;">Volver al Menú</button>
    `;
  }
}

// Inicialización Automática al cargar juego.html
window.onload = () => {
  inicializarRosco();
  modalBienvenida();
};
