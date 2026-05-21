// ==========================================================================
// 1. CONFIGURACIÓN Y ESTADO GLOBAL DEL JUEGO
// ==========================================================================
const ROSETTA_LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXY Z".replace(" ", "").split(""); 
let estadoRosco = {}; 
let indiceLetraActual = 0;
let segundaVueltaActiva = false;

// Relojes y contadores globales
let tiempoTotalSegundos = 0;
let cronometroGlobal;
let relojPregunta;
let tiempoPreguntaRestante = 15;

const listaOpcionesRuleta = [
    "GEOGRAFÍA", "INFORMÁTICA", "HISTORIA", "MÚSICA", 
    "ENTRETENIMIENTO", "DEPORTES", "COMODIN_MAS", "COMODIN_MENOS"
];
let gradosAcumulados = 0;

// Elementos del DOM (Modales Independientes)
const modalSistema = document.getElementById('modal-sistema');
const modalRuleta = document.getElementById('modal-ruleta');
const modalPregunta = document.getElementById('modal-pregunta');

const sistemaDinamico = document.getElementById('sistema-dinamico');
const preguntaDinamica = document.getElementById('pregunta-dinamica');
const ruletaDisco = document.getElementById('ruleta-neon');
const btnGirarRuleta = document.getElementById('btn-girar-ruleta');
const ruletaLetraTitulo = document.getElementById('ruleta-letra-titulo');

const roscoElement = document.getElementById('rosco');
const gameClockElement = document.getElementById('game-clock');

// ==========================================================================
// 2. INICIALIZACIÓN: RENDERIZAR EL ROSCO EN CÍRCULO PERFECTO
// ==========================================================================
function inicializarRosco() {
    roscoElement.innerHTML = '';
    const totalLetras = ROSETTA_LETTERS.length;
    const radio = 290; 
    const centroX = centerCoordOffset(650); // Centrado de caja relativo
    const centroY = centerCoordOffset(650);

    function centerCoordOffset(boxSize) { return (boxSize / 2) - 27.5; }

    ROSETTA_LETTERS.forEach((letra, index) => {
        estadoRosco[letra] = 'bloqueado';

        const div = document.createElement('div');
        div.innerText = letra;
        div.id = `letra-${letra}`;
        div.classList.add('letra-rosco');

        // Trigonometría para posicionar en círculo iniciando arriba en la 'A'
        const angulo = (index / totalLetras) * 2 * Math.PI - Math.PI / 2;
        const x = centroX + radio * Math.cos(angulo);
        const y = centroY + radio * Math.sin(angulo);

        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        div.addEventListener('click', () => {
            if (estadoRosco[letra] === 'activa') {
                abrirRuletaCategoria(letra);
            }
        });

        roscoElement.appendChild(div);
    });

    actualizarLetraActiva('A');
}

function actualizarLetraActiva(letra) {
    // Apaga el estado activo de la letra vieja en el diccionario de datos
    Object.keys(estadoRosco).forEach(key => {
        if(estadoRosco[key] === 'activa') estadoRosco[key] = 'bloqueado';
    });

    estadoRosco[letra] = 'activa';
    
    // Sincroniza clases CSS de todo el rosco
    ROSETTA_LETTERS.forEach(l => {
        const el = document.getElementById(`letra-${l}`);
        if (!el) return;
        
        if (l === letra && (estadoRosco[l] === 'activa' || estadoRosco[l] === 'bloqueado')) {
            el.className = 'letra-rosco activa';
        } else if (estadoRosco[l] === 'correcto') {
            el.className = 'letra-rosco correcta';
        } else if (estadoRosco[l] === 'incorrecto') {
            el.className = 'letra-rosco incorrecta';
        } else if (estadoRosco[l] === 'volta') {
            el.className = 'letra-rosco volta';
        } else {
            el.className = 'letra-rosco';
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
    document.getElementById('btn-start-game').addEventListener('click', () => {
        modalSistema.style.display = "none";
        iniciarCuentaAtras();
    });
    document.getElementById('btn-cancel-game').addEventListener('click', () => { 
        window.location.href = 'index.html'; 
    });
}

function iniciarCuentaAtras() {
    const countdownScreen = document.getElementById('countdown-screen');
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
        const minutos = String(Math.floor(tiempoTotalSegundos / 60)).padStart(2, '0');
        const segundos = String(tiempoTotalSegundos % 60).padStart(2, '0');
        gameClockElement.innerText = `${minutos}:${segundos}`;
    }, 1000);
}

// ==========================================================================
// 4. LÓGICA DE GIRO DE LA RULETA NEÓN Y COMODINES
// ==========================================================================
function abrirRuletaCategoria(letra) {
    document.querySelectorAll('.sector').forEach(s => s.classList.remove('ganador-iluminado'));
    ruletaLetraTitulo.innerText = letra;
    btnGirarRuleta.style.display = "inline-block";
    modalRuleta.style.display = "flex";
}

btnGirarRuleta.addEventListener('click', () => {
    btnGirarRuleta.style.display = "none"; 

    const indiceGanador = Math.floor(Math.random() * listaOpcionesRuleta.length);
    const opcionFinal = listaOpcionesRuleta[indiceGanador];

    const anguloPorSector = 45;
    const compensacionGiro = 360 - (indiceGanador * anguloPorSector);
    gradosAcumulados += (360 * 5) + compensacionGiro - (gradosAcumulados % 360);

    ruletaDisco.style.transform = `rotate(${gradosAcumulados}deg)`;

    setTimeout(() => {
        const sectores = document.querySelectorAll('.sector');
        sectores[indiceGanador].classList.add('ganador-iluminado');

        setTimeout(() => {
            modalRuleta.style.display = "none";
            evaluarResultadoRuleta(letraActual(), opcionFinal);
        }, 1200);
    }, 4000);
});

function evaluarResultadoRuleta(letra, resultado) {
    if (resultado === "COMODIN_MAS") {
        tiempoTotalSegundos += 15;
        mostrarModalComodin(letra, "¡COMODÍN MALO! +15 Segundos añadidos al cronómetro global.", "#fe0851");
        abrirRuletaCategoria(letra);
    } 
    else if (resultado === "COMODIN_MENOS") {
        tiempoTotalSegundos = Math.max(0, tiempoTotalSegundos - 15);
        mostrarModalComodin(letra, "¡COMODÍN BUENO! -15 Segundos rebajados del cronómetro global.", "#00ff87");
        abrirRuletaCategoria(letra);
    } 
    else {
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

    document.getElementById('btn-continuar-comodin').addEventListener('click', () => {
        modalPregunta.style.display = "none";
        abrirRuletaCategoria(letra);
    });
}

// ==========================================================================
// 5. CARGAR PREGUNTA Y TEMPORIZADOR DE 15 SEGUNDOS
// ==========================================================================
async function cargarPreguntaAPI(letra, categoria) {
    preguntaDinamica.innerHTML = `<h4>Cargando pregunta...</h4>`;
    modalPregunta.style.display = "flex";
    
    try {
        // Simulación controlada de Base de Datos / Endpoint API
        const mockData = {
            pregunta: `Con la ${letra}: Muestra de pregunta simulada para la categoría ${categoria}. ¿Cuál es la opción correcta?`,
            opciones: ["Opción Correcta", "Opción Incorrecta B", "Opción Incorrecta C", "Opción Incorrecta D"].sort(() => Math.random() - 0.5),
            correcta: "Opción Correcta"
        };

        desplegarPreguntaEnModal(letra, mockData);
    } catch (error) {
        preguntaDinamica.innerHTML = `<p>Error al cargar la pregunta desde el servidor.</p>`;
    }
}

function desplegarPreguntaEnModal(letra, dataPregunta) {
    preguntaDinamica.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Letra ${letra}</h3>
            <div id="pregunta-timer" style="font-weight:bold; font-size:1.3rem; color:#ffde00;">15s</div>
        </div>
        <div class="timer-bar-container"><div id="t-bar" class="timer-bar"></div></div>
        
        <p style="margin: 20px 0; font-size:1.1rem; text-align:left;">${dataPregunta.pregunta}</p>
        
        <div id="opciones-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
            ${dataPregunta.opciones.map(opc => `<button class="btn-opcion-select" style="padding:12px; background:#1a1a3a; color:#fff; border:1px solid #333; cursor:pointer; text-align:left; border-radius:6px;">${opc}</button>`).join('')}
        </div>
        
        <button id="btn-pasapalabra" style="width:100%; padding:10px; background:#ffde00; color:#000; font-weight:bold; border:none; cursor:pointer; border-radius:6px;">VOLTA (Pasar Palabra)</button>
    `;

    tiempoPreguntaRestante = 15;
    const timerText = document.getElementById('pregunta-timer');
    const timerBar = document.getElementById('t-bar');

    relojPregunta = setInterval(() => {
        tiempoPreguntaRestante--;
        timerText.innerText = `${tiempoPreguntaRestante}s`;
        timerBar.style.width = `${(tiempoPreguntaRestante / 15) * 100}%`;

        if (tiempoPreguntaRestante <= 0) {
            clearInterval(relojPregunta);
            modalPregunta.style.display = "none";
            evaluarRespuesta(letra, null, dataPregunta.correcta, true); 
        }
    }, 1000);

    const botonesOpciones = document.querySelectorAll('.btn-opcion-select');
    botonesOpciones.forEach(btn => {
        btn.addEventListener('click', () => {
            clearInterval(relojPregunta);
            modalPregunta.style.display = "none";
            evaluarRespuesta(letra, btn.innerText, dataPregunta.correcta, false);
        });
    });

    document.getElementById('btn-pasapalabra').addEventListener('click', () => {
        clearInterval(relojPregunta);
        modalPregunta.style.display = "none";
        evaluarRespuesta(letra, 'VOLTA', dataPregunta.correcta, false);
    });
}

// ==========================================================================
// 6. EVALUACIÓN DE RESPUESTAS Y MÁQUINA DE ESTADOS (CAMBIOS DE TURNO)
// ==========================================================================
function evaluarRespuesta(letra, respuestaUsuario, respuestaCorrecta, esTiempoAgotado) {
    if (esTiempoAgotado) {
        estadoRosco[letra] = 'incorrecto';
        actualizarContadoresMarcador('fallo');
    } else if (respuestaUsuario === 'VOLTA') {
        estadoRosco[letra] = 'volta';
    } else if (respuestaUsuario === respuestaCorrecta) {
        estadoRosco[letra] = 'correcto';
        actualizarContadoresMarcador('acierto');
    } else {
        estadoRosco[letra] = 'incorrecto';
        actualizarContadoresMarcador('fallo');
    }

    avanzarSiguienteTurno();
}

function actualizarContadoresMarcador(tipo) {
    if (tipo === 'acierto') {
        const c = document.getElementById('score-correct');
        c.innerText = Number(c.innerText) + 1;
    } else {
        const f = document.getElementById('score-incorrect');
        f.innerText = Number(f.innerText) + 1;
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

        if (!segundaVueltaActiva && estadoRosco[letraEvaluada] === 'bloqueado') {
            encontrado = true;
            actualizarLetraActiva(letraEvaluada);
        } 
        else if (segundaVueltaActiva && estadoRosco[letraEvaluada] === 'volta') {
            encontrado = true;
            actualizarLetraActiva(letraEvaluada);
        }
    }

    if (!encontrado) {
        finalizarJuego();
    }
}

function finalizarJuego() {
    clearInterval(cronometroGlobal);
    modalSistema.style.display = "flex";
    
    const aciertos = document.getElementById('score-correct').innerText;
    const fallos = document.getElementById('score-incorrect').innerText;

    sistemaDinamico.innerHTML = `
        <h2>¡Rosco Completado! 🏁</h2>
        <p style="margin:15px 0;">Has terminado el juego con los siguientes resultados:</p>
        <p><b>Tiempo Total:</b> ${gameClockElement.innerText}</p>
        <p style="color:#00ff87;"><b>Aciertos:</b> ${aciertos}</p>
        <p style="color:#fe0851;"><b>Fallos:</b> ${fallos}</p>
        <button onclick="window.location.href='index.html'" class="btn-game-neon" style="margin-top:20px;">Volver al Inicio</button>
    `;
}

// Inicialización Automática al cargar juego.html
window.onload = () => {
    inicializarRosco();
    modalBienvenida();
};