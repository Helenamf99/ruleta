package org.patriciabausan.service;

import org.patriciabausan.dto.PreguntaConRespuestaDTO;
import org.patriciabausan.dto.UsuarioRegistroDTO;
import org.patriciabausan.model.*;
import org.patriciabausan.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;

@Service
public class JuegoService {

    private UsuarioRepository usuarioRepository;
    private PartidaRepository partidaRepository;
    private CategoriaRepository categoriaRepository;
    private PreguntaRepository preguntaRepository;
    private RespuestaRepository respuestaRepository; // <-- 1. Añadimos la variable que faltaba

    // Constructor: Añadimos la RespuestaRepository aquí dentro también
    public JuegoService(UsuarioRepository usuarioRepository,
                        PartidaRepository partidaRepository,
                        CategoriaRepository categoriaRepository,
                        PreguntaRepository preguntaRepository,
                        RespuestaRepository respuestaRepository) { // <-- 2. La metemos en los parámetros
        this.usuarioRepository = usuarioRepository;
        this.partidaRepository = partidaRepository;
        this.categoriaRepository = categoriaRepository;
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository; // <-- 3. La asignamos
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

    // ============ MÉTODO 3: Registrar un nuevo usuario ============
    public Usuario registrarUsuario(UsuarioRegistroDTO dto) {
        // Primero comprobar si el nombre de usuario ya existe
        List<Usuario> todosLosUsuarios = usuarioRepository.findAll();

        for (int i = 0; i < todosLosUsuarios.size(); i++) {
            Usuario u = todosLosUsuarios.get(i);
            if (u.getNombreUsuario().equals(dto.getNombreUsuario())) {
                throw new RuntimeException("Ese nombre de usuario ya existe");
            }
        }

        // Crear nuevo usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(dto.getNombreUsuario());
        nuevoUsuario.setPuntosMaximos(0);
        nuevoUsuario.setMejorTiempo(null);

        // Guardar en la base de datos
        return usuarioRepository.save(nuevoUsuario);
    }

    // ============ MÉTODO 4: Finalizar una partida ============
    public Partida finalizarPartida(Integer usuarioId, Integer puntos, LocalTime tiempo) {
        // Buscar el usuario por su ID
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Crear nueva partida
        Partida partida = new Partida();
        partida.setUsuario(usuario);
        partida.setPuntos(puntos);
        partida.setTiempo(tiempo);

        // Guardar partida
        Partida partidaGuardada = partidaRepository.save(partida);

        // Actualizar puntos máximos del usuario si es necesario
        if (usuario.getPuntosMaximos() == null || puntos > usuario.getPuntosMaximos()) {
            usuario.setPuntosMaximos(puntos);
        }

        // Actualizar mejor tiempo del usuario si es necesario
        if (usuario.getMejorTiempo() == null || tiempo.isBefore(usuario.getMejorTiempo())) {
            usuario.setMejorTiempo(tiempo);
        }

        // Guardar los cambios del usuario
        usuarioRepository.save(usuario);

        return partidaGuardada;
    }

    // ============ MÉTODO 5: Top 3 con menor tiempo ============
    public List<Usuario> top3MenorTiempo() {
        // Obtener todos los usuarios
        List<Usuario> todos = usuarioRepository.findAll();

        // Crear una lista solo con los que tienen tiempo registrado
        List<Usuario> conTiempo = new ArrayList<>();

        for (int i = 0; i < todos.size(); i++) {
            Usuario u = todos.get(i);
            if (u.getMejorTiempo() != null) {
                conTiempo.add(u);
            }
        }

        // Ordenar por tiempo (método burbuja simple)
        for (int i = 0; i < conTiempo.size() - 1; i++) {
            for (int j = 0; j < conTiempo.size() - i - 1; j++) {
                // Si el tiempo de j es mayor que el de j+1, intercambiar
                if (conTiempo.get(j).getMejorTiempo().compareTo(conTiempo.get(j+1).getMejorTiempo()) > 0) {
                    Usuario temp = conTiempo.get(j);
                    conTiempo.set(j, conTiempo.get(j+1));
                    conTiempo.set(j+1, temp);
                }
            }
        }

        // Coger los 3 primeros (o menos si hay menos de 3)
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

        // Crear el ranking con los datos de cada usuario
        for (int i = 0; i < usuarios.size(); i++) {
            Usuario u = usuarios.get(i);

            Map<String, Object> datosUsuario = new HashMap<>();
            datosUsuario.put("usuarioId", u.getId());
            datosUsuario.put("nombreUsuario", u.getNombreUsuario());
            datosUsuario.put("mejorTiempo", u.getMejorTiempo());
            datosUsuario.put("puntosMaximos", u.getPuntosMaximos());

            ranking.add(datosUsuario);
        }

        // Ordenar por mejor tiempo (los null al final)
        for (int i = 0; i < ranking.size() - 1; i++) {
            for (int j = 0; j < ranking.size() - i - 1; j++) {
                Map<String, Object> a = ranking.get(j);
                Map<String, Object> b = ranking.get(j+1);

                LocalTime tiempoA = (LocalTime) a.get("mejorTiempo");
                LocalTime tiempoB = (LocalTime) b.get("mejorTiempo");

                // Si A es null y B no, A debe ir después
                if (tiempoA == null && tiempoB != null) {
                    // Intercambiar
                    ranking.set(j, b);
                    ranking.set(j+1, a);
                }
                // Si ambos no son null y A > B, intercambiar
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

        // 🔴 CHIVATO 1: ¿Cuántas preguntas saca de la base de datos de tu compañero?
        System.out.println("--> PASO 1: Preguntas recuperadas de la BD = " + (preguntas != null ? preguntas.size() : "NULL"));

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

            // 🔴 CHIVATO 2: ¿Tiene respuestas asignadas esta pregunta en la BD?
            System.out.println("--> PASO 2: Pregunta ID " + pregunta.getId() + " tiene " + (respuestasOriginales != null ? respuestasOriginales.size() : "NULL") + " respuestas originales.");

            for (int j = 0; j < respuestasOriginales.size(); j++) {
                Respuesta respuesta = respuestasOriginales.get(j);
                PreguntaConRespuestaDTO.RespuestaDTO dtoRespuesta = new PreguntaConRespuestaDTO.RespuestaDTO();
                dtoRespuesta.setIdRespuesta(respuesta.getId());
                dtoRespuesta.setTexto(respuesta.getTexto());
                dtoRespuesta.setCorrecta(respuesta.isCorrecta());
                respuestasDTO.add(dtoRespuesta);
            }

            dtoPregunta.setRespuestas(respuestasDTO);
            resultado.add(dtoPregunta);
        }

        // 🔴 CHIVATO 3: ¿Cuántos DTOs se van a enviar al controlador?
        System.out.println("--> PASO 3: DTOs en la lista de salida = " + resultado.size());

        return resultado;
    }

    // Método para cargar todos los usuarios desde el service
    public List<Usuario> cargarUsuarios() {
        return usuarioRepository.findAll();
        // Nota: Si tu repositorio de usuarios se llama diferente (ej. userRepository), cambia el nombre.
    }

    // Método para cargar todas las respuestas desde el service
    public List<Respuesta> cargarRespuestas() {
        return respuestaRepository.findAll();
        // Nota: Si tu repositorio de respuestas se llama diferente, cámbialo aquí también.
    }
}