// admin.js
const API_BASE = 'http://localhost:8081';

// Función genérica para peticiones
async function fetchAPI(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

// ========== CARGAR DATOS ==========
async function cargarUsuarios() {
    const tbody = document.getElementById('lista-usuarios');
    tbody.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';
    try {
        const usuarios = await fetchAPI('/usuarios');
        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No hay usuarios registrados.</td></tr>';
            return;
        }
        tbody.innerHTML = usuarios.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombreUsuario || u.nombre_usuario || ''}</td>
                <td>${u.email || ''}</td>
                <td><button onclick="eliminarUsuario(${u.id})">Eliminar</button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="4">Error al cargar usuarios. Revisa la consola.</td></tr>';
    }
}

async function cargarRankings() {
    const lista = document.getElementById('lista-rankings');
    lista.innerHTML = '<li>Cargando...</li>';
    try {
        const ranking = await fetchAPI('/ranking');
        if (ranking.length === 0) {
            lista.innerHTML = '<li>No hay datos de ranking.</li>';
            return;
        }
        lista.innerHTML = ranking.map((r, idx) => `
            <li>${idx+1}. ${r.nombreUsuario || r.usuario} - ${r.puntos || r.puntosMaximos} puntos</li>
        `).join('');
    } catch (error) {
        console.error(error);
        lista.innerHTML = '<li>Error al cargar ranking.</li>';
    }
}

async function cargarPreguntas() {
    const lista = document.getElementById('lista-preguntas');
    lista.innerHTML = '<li>Cargando...</li>';
    try {
        const preguntas = await fetchAPI('/preguntas');
        if (preguntas.length === 0) {
            lista.innerHTML = '<li>No hay preguntas registradas.</li>';
            return;
        }
        // Mostrar solo enunciado (puedes ampliar)
        lista.innerHTML = preguntas.map(p => `
            <li><strong>${p.enunciado || p.texto}</strong> (ID: ${p.id_pregunta || p.id})</li>
        `).join('');
    } catch (error) {
        console.error(error);
        lista.innerHTML = '<li>Error al cargar preguntas.</li>';
    }
}

// Eliminar usuario (CORREGIDO: usa la ruta correcta)
async function eliminarUsuario(id) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
        // ✅ Ahora usa la URL correcta que espera el backend
        const response = await fetch(`${API_BASE}/eliminar/usuarios/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Usuario eliminado correctamente');
            cargarUsuarios();  // Recargar la lista
        } else {
            const errorText = await response.text();
            alert(`Error al eliminar usuario: ${errorText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
}

// ========== GESTIÓN DE PESTAÑAS ==========
function openTab(event, tabName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => {
        section.classList.remove('active-content');
        section.style.display = 'none';
    });
    // Mostrar la seleccionada
    const activeSection = document.getElementById(tabName);
    if (activeSection) {
        activeSection.style.display = 'block';
        activeSection.classList.add('active-content');
    }
    // Actualizar estilo de botones (opcional)
    const buttons = document.querySelectorAll('.tabBtn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // Cargar datos según la pestaña
    if (tabName === 'usuarios') cargarUsuarios();
    if (tabName === 'rankings') cargarRankings();
    if (tabName === 'preguntas') cargarPreguntas();
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Simular clic en la primera pestaña (usuarios)
    const firstTab = document.querySelector('.tabBtn');
    if (firstTab) {
        const fakeEvent = { currentTarget: firstTab };
        openTab(fakeEvent, 'usuarios');
    } else {
        openTab(null, 'usuarios');
    }
});