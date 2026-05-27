function openTab(evt, tabName) {
const contents = document.querySelectorAll('.tab-content');
contents.forEach(content => content.classList.remove('active-content'));

const buttons = document.querySelectorAll('.tabBtn');
buttons.forEach(btn => btn.classList.remove('active'));

document.getElementById(tabName).classList.add('active-content');
evt.currentTarget.classList.add('active');

if (tabName === 'usuarios') cargarUsuarios();
if (tabName === 'rankings') cargarRankings();
if (tabName === 'preguntas') cargarPreguntas();
}

async function cargarUsuarios() {
    try {
        const respuesta = await fetch('http://localhost/usuarios/');
        const usuarios = await respuesta.json();
        const tbody = document.getElementById('lista-usuarios');
        tbody.innerHTML = ''; 

        usuarios.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td><span id="name-${user.id}">${user.username}</span></td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="modificarNombre(${user.id}, '${user.email}')">Modificar</button>
                        <button class="btn-danger" onclick="eliminarUsuario(${user.id}, '${user.email}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}


async function eliminarUsuario(id, email) {
    if (!confirm(`¿Seguro que quieres eliminar al usuario con ID ${id}?`))return;

    const tokeAdmin = localStorage.getItem("tokenSesion");
        try {
            const respuesta = await fetch(`http://localhost/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': tokeAdmin,
                    'Content-Type':'aplication/json'
                }
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
    }


async function modificarNombre(id, email) {
    const nuevoNombre = prompt("Introduce el nuevo nuevo nombre para el usuario. ):");
    if (!nuevoNombre) return;

    try {
        const respuesta = await fetch(`http://localhost/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/center-json' || 'application/json' },
            body: JSON.stringify({ username: nuevoNombre })
        });

        if (respuesta.ok) {
            alert("Nombre modificado. El usuario recibirá un aviso.");
            cargarUsuarios();
        }
    } catch (error) {
        console.error("Error al modificar:", error);
    }
}

cargarUsuarios();