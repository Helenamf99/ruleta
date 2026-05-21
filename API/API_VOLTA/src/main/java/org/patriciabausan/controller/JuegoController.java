package org.patriciabausan.controller;

import org.patriciabausan.dto.PreguntaConRespuestaDTO;
import org.patriciabausan.dto.UsuarioRegistroDTO;
import org.patriciabausan.model.Categoria;
import org.patriciabausan.model.Partida;
import org.patriciabausan.model.Usuario;
import org.patriciabausan.service.JuegoService;
import org.springframework.beans.factory.annotation.Autowired;
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
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
}