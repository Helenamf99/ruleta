package org.patriciabausan.service;

import org.patriciabausan.dto.PreguntaConRespuestaDTO;
import org.patriciabausan.dto.UsuarioRegistroDTO;
import org.patriciabausan.model.*;
import org.patriciabausan.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class JuegoService {

    private UsuarioRepository usuarioRepository;
    private PartidaRepository partidaRepository;
    private CategoriaRepository categoriaRepository;
    private PreguntaRepository preguntaRepository;
    private RespuestaRepository respuestaRepository;

    public JuegoService(UsuarioRepository usuarioRepository,
                        PartidaRepository partidaRepository,
                        CategoriaRepository categoriaRepository,
                        PreguntaRepository preguntaRepository,
                        RespuestaRepository respuestaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.partidaRepository = partidaRepository;
        this.categoriaRepository = categoriaRepository;
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository;
    }

    // ============ MÉTODO 1: Cargar todas las categorías ============
    public List<Categoria> cargarCategorias() {
        return categoriaRepository.findAll();
    }

    // ============ MÉTODO 2: Cargar partidas de un usuario ============
    public List<Partida> cargarPartidas(Integer usuarioId) {
        if (usuarioId != null) {
            return partidaRepository.findByUsuarioId(usuarioId);
        } else {
            return partidaRepository.findAll();
        }
    }

    // ============ MÉTODO 3: Registrar un nuevo usuario (VALIDADO) ============
    public Usuario registrarUsuario(UsuarioRegistroDTO dto) {
        List<Usuario> todosLosUsuarios = usuarioRepository.findAll();

        // Validación doble de duplicados (Nombre de usuario y Email)
        for (int i = 0; i < todosLosUsuarios.size(); i++) {
            Usuario u = todosLosUsuarios.get(i);

            if (u.getNombreUsuario().equalsIgnoreCase(dto.getNombreUsuario())) {
                throw new RuntimeException("Ese nombre de usuario ya existe.");
            }
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(dto.getEmail())) {
                throw new RuntimeException("Ese correo electrónico ya está registrado.");
            }
        }

        // Crear nuevo usuario mapeado con las columnas de tu base de datos unificada
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(dto.getNombreUsuario());
        nuevoUsuario.setEmail(dto.getEmail());
        nuevoUsuario.setPassword(dto.getPassword());
        nuevoUsuario.setFechaRegistro(LocalDate.now());
        nuevoUsuario.setIsAdmin(false);
        nuevoUsuario.setPuntosMaximos(0);
        nuevoUsuario.setMejorTiempo(null);

        // Guardar en la base de datos
        return usuarioRepository.save(nuevoUsuario);
    }

    // ============ MÉTODO 4: Finalizar una partida ============
    public Partida finalizarPartida(Integer usuarioId, Integer puntos, LocalTime tiempo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Partida partida = new Partida();
        partida.setUsuario(usuario);
        partida.setPuntos(puntos);
        partida.setTiempo(tiempo);

        Partida partidaGuardada = partidaRepository.save(partida);

        if (usuario.getPuntosMaximos() == null || puntos > usuario.getPuntosMaximos()) {
            usuario.setPuntosMaximos(puntos);
        }

        if (usuario.getMejorTiempo() == null || tiempo.isBefore(usuario.getMejorTiempo())) {
            usuario.setMejorTiempo(tiempo);
        }

        usuarioRepository.save(usuario);

        return partidaGuardada;
    }

    // ============ MÉTODO 5: Top 3 con menor tiempo ============
    public List<Usuario> top3MenorTiempo() {
        List<Usuario> todos = usuarioRepository.findAll();
        List<Usuario> conTiempo = new ArrayList<>();

        for (int i = 0; i < todos.size(); i++) {
            Usuario u = todos.get(i);
            if (u.getMejorTiempo() != null) {
                conTiempo.add(u);
            }
        }

        for (int i = 0; i < conTiempo.size() - 1; i++) {
            for (int j = 0; j < conTiempo.size() - i - 1; j++) {
                if (conTiempo.get(j).getMejorTiempo().compareTo(conTiempo.get(j+1).getMejorTiempo()) > 0) {
                    Usuario temp = conTiempo.get(j);
                    conTiempo.set(j, conTiempo.get(j+1));
                    conTiempo.set(j+1, temp);
                }
            }
        }

        List<Usuario> top3 = new ArrayList<>();
        int limite = conTiempo.size();
        if (limite > 3) {
            limite = 3;
        }

        for (int i = 0; i < limite; i++) {
            top3.add(conTiempo.get(i));
        }

        return top3;
    }

    // ============ MÉTODO 6: Ranking completo ============
    public List<Map<String, Object>> rankingCompleto() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Map<String, Object>> ranking = new ArrayList<>();

        for (int i = 0; i < usuarios.size(); i++) {
            Usuario u = usuarios.get(i);

            Map<String, Object> datosUsuario = new HashMap<>();
            datosUsuario.put("usuarioId", u.getId());
            datosUsuario.put("nombreUsuario", u.getNombreUsuario());
            datosUsuario.put("mejorTiempo", u.getMejorTiempo());
            datosUsuario.put("puntosMaximos", u.getPuntosMaximos());

            ranking.add(datosUsuario);
        }

        for (int i = 0; i < ranking.size() - 1; i++) {
            for (int j = 0; j < ranking.size() - i - 1; j++) {
                Map<String, Object> a = ranking.get(j);
                Map<String, Object> b = ranking.get(j+1);

                LocalTime tiempoA = (LocalTime) a.get("mejorTiempo");
                LocalTime tiempoB = (LocalTime) b.get("mejorTiempo");

                if (tiempoA == null && tiempoB != null) {
                    ranking.set(j, b);
                    ranking.set(j+1, a);
                }
                else if (tiempoA != null && tiempoB != null && tiempoA.compareTo(tiempoB) > 0) {
                    Map<String, Object> temp = ranking.get(j);
                    ranking.set(j, ranking.get(j+1));
                    ranking.set(j+1, temp);
                }
            }
        }

        return ranking;
    }

    // ============ MÉTODO 7: Cargar preguntas por categoría ============
    public List<PreguntaConRespuestaDTO> cargarPreguntas(Integer categoriaId) {
        List<Pregunta> preguntas;

        if (categoriaId != null) {
            preguntas = preguntaRepository.findByCategoriaId(categoriaId);
        } else {
            preguntas = preguntaRepository.findAll();
        }

        List<PreguntaConRespuestaDTO> resultado = new ArrayList<>();

        for (int i = 0; i < preguntas.size(); i++) {
            Pregunta pregunta = preguntas.get(i);

            PreguntaConRespuestaDTO dtoPregunta = new PreguntaConRespuestaDTO();
            dtoPregunta.setIdPregunta(pregunta.getId());
            dtoPregunta.setEnunciado(pregunta.getEnunciado());
            dtoPregunta.setCategoriaId(pregunta.getCategoria().getId());
            dtoPregunta.setCategoriaNombre(pregunta.getCategoria().getNombre());

            List<PreguntaConRespuestaDTO.RespuestaDTO> respuestasDTO = new ArrayList<>();
            List<Respuesta> respuestasOriginales = pregunta.getRespuestas();

            for (int j = 0; j < respuestasOriginales.size(); j++) {
                Respuesta respuesta = respuestasOriginales.get(j);
                PreguntaConRespuestaDTO.RespuestaDTO dtoRespuesta = new PreguntaConRespuestaDTO.RespuestaDTO();
                dtoRespuesta.setIdRespuesta(Sub_id(respuesta)); // Se asume el método de mapear id
                dtoRespuesta.setTexto(respuesta.getTexto());
                dtoRespuesta.setCorrecta(respuesta.isCorrecta());
                respuestasDTO.add(dtoRespuesta);
            }

            dtoPregunta.setRespuestas(respuestasDTO);
            resultado.add(dtoPregunta);
        }

        return resultado;
    }

    // Método auxiliar interno para simplificar la lectura del ID de respuesta
    private Integer Sub_id(Respuesta r) {
        return r.getId();
    }

    // ============ MÉTODO 8: Cargar todos los usuarios ============
    public List<Usuario> cargarUsuarios() {
        return usuarioRepository.findAll();
    }

    // ============ MÉTODO 9: Cargar todas las respuestas ============
    public List<Respuesta> cargarRespuestas() {
        return respuestaRepository.findAll();
    }
}