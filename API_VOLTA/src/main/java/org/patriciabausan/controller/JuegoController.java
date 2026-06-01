package org.patriciabausan.controller;

import org.patriciabausan.dto.PreguntaConRespuestaDTO;
import org.patriciabausan.dto.UsuarioRegistroDTO;
import org.patriciabausan.model.Categoria;
import org.patriciabausan.model.Partida;
import org.patriciabausan.model.Respuesta;
import org.patriciabausan.model.Usuario;
import org.patriciabausan.service.JuegoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
public class JuegoController {

    @Autowired
    private JuegoService juegoService;

    // 1. Cargar todas las categorías
    @GetMapping("/categorias")
    public List<Categoria> getCategorias() {
        return juegoService.cargarCategorias();
    }

    // 2. Cargar partidas (todas o por usuario)
    @GetMapping("/partidas")
    public List<Partida> getPartidas(@RequestParam(required = false) Integer usuarioId) {
        return juegoService.cargarPartidas(usuarioId);
    }

    // 3. Registrar un nuevo usuario
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO dto) {
        try {
            Usuario nuevo = juegoService.registrarUsuario(dto);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        String password = datos.get("password");

        List<Usuario> listaUsuarios = juegoService.cargarUsuarios();

        for (Usuario u : listaUsuarios) {
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(email) && u.getPassword().equals(password)) {

                // 🌟 BLINDADO: Si el valor en la BDD es null, lo convertimos de forma segura a 'false'
                boolean esAdministrador = (u.getIsAdmin() != null) && u.getIsAdmin();

                // Usamos un HashMap tradicional en lugar de Map.of para evitar errores si algo viene vacío
                Map<String, Object> respuesta = new java.util.HashMap<>();
                respuesta.put("id", u.getId());
                respuesta.put("username", u.getNombreUsuario());
                respuesta.put("email", u.getEmail());
                respuesta.put("isAdmin", esAdministrador);
                respuesta.put("mensaje", "¡Login correcto!");

                return ResponseEntity.ok(respuesta);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", "Correo electrónico o contraseña incorrectos"));
    }

    // 4. Finalizar una partida (guardar tiempo y puntos)
    @PostMapping("/partidas/finalizar")
    public Partida finalizarPartida(@RequestParam Integer usuarioId,
                                    @RequestParam Integer puntos,
                                    @RequestParam String tiempo) {
        LocalTime tiempoPartida = LocalTime.parse(tiempo);
        return juegoService.finalizarPartida(usuarioId, puntos, tiempoPartida);
    }

    // 5. Top 3 usuarios con menor tiempo
    @GetMapping("/top3")
    public List<Usuario> top3() {
        return juegoService.top3MenorTiempo();
    }

    // 6. Ranking completo de usuarios
    @GetMapping("/ranking")
    public List<Map<String, Object>> ranking() {
        return juegoService.rankingCompleto();
    }

    // 7. Cargar preguntas (con sus respuestas), opcional por categoría
    @GetMapping("/preguntas")
    public List<PreguntaConRespuestaDTO> getPreguntas(@RequestParam(required = false) Integer categoriaId) {
        return juegoService.cargarPreguntas(categoriaId);
    }

    // 8. Cargar todos los usuarios para pruebas locales
    @GetMapping("/usuarios")
    public List<Usuario> getUsuarios() {
        return juegoService.cargarUsuarios();
    }

    // 9. Cargar todas las respuestas para pruebas locales
    @GetMapping("/respuestas")
    public List<Respuesta> getRespuestas() {
        return juegoService.cargarRespuestas();
    }

    // Endpoints para recuperar contraseña
    @PostMapping("/recuperar-password")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        try {
            // El servicio se encarga de todo (Token + Envío Real vía Brevo)
            juegoService.generarTokenRecuperacion(email);
            return ResponseEntity.ok(Map.of("mensaje", "Si el correo electrónico ingresado forma parte de nuestros registros recibirás un enlace para recuperar tu contraseña."));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of("mensaje", "Si el correo electrónico ingresado forma parte de nuestros registros recibirás un enlace para recuperar tu contraseña."));
        }
    } // 🌟 CORREGIDO: Ahora cierra únicamente este método

    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody Map<String, String> datos) {
        String token = datos.get("token");
        String nuevaPassword = datos.get("password");

        try {
            juegoService.actualizarPasswordPorToken(token, nuevaPassword);
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña cambiada exitosamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    // ==========================================================================
    // 🛠️ ENDPOINTS DE ADMINISTRACIÓN (AÑADIR AL FINAL DEL CONTROLLER)
    // ==========================================================================

    @DeleteMapping("/eliminar/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id, @RequestHeader("Authorizated") String token) {
        try {

            Usuario usuarioEliminado = juegoService.eliminarYNotificar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }
    // 📝 10. Modificar el nombre de un usuario
    @PutMapping("/usuarios/modificar/{id}")
    public ResponseEntity<?> modificarNombreUsuario(@PathVariable Integer id, @RequestBody Map<String, String> datos) {
        try {
            // Capturamos el nombre que envía el JavaScript
            String nuevoNombre = datos.get("nombreUsuario");

            if (nuevoNombre == null || nuevoNombre.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "El nombre de usuario no puede estar vacío."));
            }

            // Llamamos al servicio para que guarde los cambios en la base de datos
            Usuario usuarioActualizado = juegoService.actualizarNombre(id, nuevoNombre);

            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Error al modificar: " + e.getMessage()));
        }
    }
}