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
@CrossOrigin(origins = "*")
public class JuegoController {

    @Autowired
    private JuegoService juegoService;

    // Sirve para cargar las categorías
    @GetMapping("/categorias")
    public List<Categoria> getCategorias() {
        return juegoService.cargarCategorias();
    }

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

        // Buscamos en la lista de usuarios si coincide el email y contraseña
        List<Usuario> listaUsuarios = juegoService.cargarUsuarios();

        for (Usuario u : listaUsuarios) {
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(email) && u.getPassword().equals(password)) {
                return ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "username", u.getNombreUsuario(),
                        "email", u.getEmail(),
                        "mensaje", "¡Login correcto!"
                ));
            }
        }

        // 🌟 No olvides cerrar el método devolviendo el error si el bucle termina sin encontrar nada
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
        // NOTA: Si te da error en rojo 'cargarUsuarios()', avísame y creamos el método en el Service en un segundo.
    }

    // 9. Cargar todas las respuestas para pruebas locales
    @GetMapping("/respuestas")
    public List<Respuesta> getRespuestas() {
        return juegoService.cargarRespuestas();
        // NOTA: Lo mismo, si se pone en rojo, necesitaremos añadir el método en tu JuegoService.
    }
    @DeleteMapping ("/eliminar/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id, @RequestHeader("Authorizated")String token ) {
//        if (!juegoService.esAdmin(token)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                    .body("Error: No tienes permisos de administrador");
//        }

        Usuario usuarioEliminado = juegoService.eliminarYNotificar(id);
        return ResponseEntity.ok(usuarioEliminado);
    }

}