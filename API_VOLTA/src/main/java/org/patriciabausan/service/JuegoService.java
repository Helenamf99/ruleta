package org.patriciabausan.service;

import org.patriciabausan.dto.PreguntaConRespuestaDTO;
import org.patriciabausan.dto.UsuarioRegistroDTO;
import org.patriciabausan.model.*;
import org.patriciabausan.repository.*;
import org.springframework.stereotype.Service;

// 🌟 INYECTAMOS EL MOTOR DE CORREO REQUERIDO
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.InternetAddress;

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

    // Variable del motor de envío de correos
    private JavaMailSender mailSender;

    // Constructor limpio con todas las dependencias reales
    public JuegoService(UsuarioRepository usuarioRepository,
                        PartidaRepository partidaRepository,
                        CategoriaRepository categoriaRepository,
                        PreguntaRepository preguntaRepository,
                        RespuestaRepository respuestaRepository,
                        JavaMailSender mailSender) {
        this.usuarioRepository = usuarioRepository;
        this.partidaRepository = partidaRepository;
        this.categoriaRepository = categoriaRepository;
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository;
        this.mailSender = mailSender;
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

        for (int i = 0; i < todosLosUsuarios.size(); i++) {
            Usuario u = todosLosUsuarios.get(i);

            if (u.getNombreUsuario().equalsIgnoreCase(dto.getNombreUsuario())) {
                throw new RuntimeException("Ese nombre de usuario ya existe.");
            }
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(dto.getEmail())) {
                throw new RuntimeException("Ese correo electrónico ya está registrado.");
            }
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(dto.getNombreUsuario());
        nuevoUsuario.setEmail(dto.getEmail());
        nuevoUsuario.setPassword(dto.getPassword());
        nuevoUsuario.setFechaRegistro(LocalDate.now());
        nuevoUsuario.setIsAdmin(false);
        nuevoUsuario.setPuntosMaximos(0);
        nuevoUsuario.setMejorTiempo(null);

        return usuarioRepository.save(nuevoUsuario);
    }

    // ============ 📧 MÉTODO MODIFICADO: Generar token único y lanzar correo real ============
    public String generarTokenRecuperacion(String email) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario u : usuarios) {
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(email)) {
                String token = UUID.randomUUID().toString();
                u.setTokenRecuperacion(token);
                usuarioRepository.save(u);

                // 🚀 LANZAMOS EL CORREO ELECTRÓNICO REAL VÍA BREVO
                enviarCorreoReal(email, token);

                return token;
            }
        }
        throw new RuntimeException("Correo no encontrado");
    }

    // ============ 📧 MÉTODO AUXILIAR: Construcción y despacho del correo estético ============
    private void enviarCorreoReal(String emailDestino, String token) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(emailDestino);
            helper.setSubject("Restablecer Contraseña - Volta Game");
            helper.setFrom(new InternetAddress("ema.martin.19@gmail.com", "Volta Game 🕹️"));

            // URL absoluta apuntando a tu Live Server de Frontend
            String enlace = "http://127.0.0.1:5500/frontend/restablecer.html?token=" + token;

            String contenido = "Hola,\n\n"
                    + "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Volta Game.\n"
                    + "Haz clic en el siguiente enlace para crear una nueva contraseña:\n\n"
                    + enlace + "\n\n"
                    + "Si no solicitaste este cambio, puedes ignorar este correo de forma segura.\n"
                    + "¡Un saludo del equipo de Volta!";

            helper.setText(contenido);
            mailSender.send(mensaje);

            System.out.println("🚀 ¡Correo de recuperación real enviado con éxito a: " + emailDestino + "!");

        } catch (Exception e) {
            System.err.println("❌ Error crítico en el SMTP de Brevo: " + e.getMessage());
            throw new RuntimeException("No se pudo despachar el correo de recuperación.");
        }
    }

    // Actualizar la contraseña usando el token real
    public void actualizarPasswordPorToken(String token, String nuevaPassword) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario u : usuarios) {
            if (u.getTokenRecuperacion() != null && u.getTokenRecuperacion().equals(token)) {
                u.setPassword(nuevaPassword);
                u.setTokenRecuperacion(null);
                usuarioRepository.save(u);
                return;
            }
        }
        throw new RuntimeException("El enlace de recuperación es inválido o ha expirado.");
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

    // ============ 🌟 MÉTODO 7 CORREGIDO: Cargar preguntas por categoría mapeando DTO simplificado ============
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

            // 🌟 NUEVO: Sincronizamos la letra de la base de datos que acabas de mapear
            dtoPregunta.setLetra(pregunta.getLetra());

            if (pregunta.getCategoria() != null) {
                dtoPregunta.setCategoriaId(pregunta.getCategoria().getId());
                dtoPregunta.setCategoriaNombre(pregunta.getCategoria().getNombre());
            }

            // 🌟 NUEVO: Extraemos de forma plana el array de textos y localizamos cuál es la correcta
            List<String> opcionesTexto = new ArrayList<>();
            String textoRespuestaCorrecta = "";
            List<Respuesta> respuestasOriginales = pregunta.getRespuestas();

            if (respuestasOriginales != null) {
                for (int j = 0; j < respuestasOriginales.size(); j++) {
                    Respuesta respuesta = respuestasOriginales.get(j);
                    opcionesTexto.add(respuesta.getTexto());

                    if (respuesta.isCorrecta()) {
                        textoRespuestaCorrecta = respuesta.getTexto();
                    }
                }
            }

            dtoPregunta.setOpciones(opcionesTexto);
            dtoPregunta.setRespuestaCorrecta(textoRespuestaCorrecta);

            resultado.add(dtoPregunta);
        }

        return resultado;
    }

    // ============ MÉTODO 8: Cargar todos los usuarios ============
    public List<Usuario> cargarUsuarios() {
        return usuarioRepository.findAll();
    }

    // ============ MÉTODO 9: Cargar todas las respuestas ============
    public List<Respuesta> cargarRespuestas() {
        return respuestaRepository.findAll();
    }

    // ==========================================================================
    // 🛠️ MÉTODOS DE ADMINISTRACIÓN
    // ==========================================================================

    public boolean esAdmin(String token) {
        try {
            Integer userId = Integer.parseInt(token);
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(userId);
            return usuarioOpt.isPresent() && Boolean.TRUE.equals(usuarioOpt.get().getIsAdmin());
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public Usuario eliminarYNotificar(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        List<Partida> partidasAsociadas = partidaRepository.findByUsuarioId(id);
        for (Partida p : partidasAsociadas) {
            partidaRepository.delete(p);
        }

        usuarioRepository.delete(usuario);
        System.out.println("🚀 [ADMIN] El usuario " + usuario.getNombreUsuario() + " ha sido eliminado con éxito.");

        return usuario;
    }

    public Usuario actualizarNombre(Integer id, String nuevoNombre) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el ID: " + id));

        usuario.setNombreUsuario(nuevoNombre);
        return usuarioRepository.save(usuario);
    }
}