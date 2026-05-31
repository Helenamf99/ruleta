package org.patriciabausan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreguntaConRespuestaDTO {
    private Integer idPregunta;
    private String enunciado;
    private String letra; // 🌟 ¡AÑADIDO! Para mapear la letra ('A', 'B', 'C'...) de la base de datos
    private Integer categoriaId;
    private String categoriaNombre;
    private String respuestaCorrecta; // 🌟 ¡AÑADIDO! El texto plano de la opción ganadora para el juego.js
    private List<String> opciones; // 🌟 ¡MODIFICADO! Simplificado a lista de textos para pintar los botones del grid fácilmente

    // Mantienes la clase estática interna por si tu JuegoService aún la mapea en otros procesos intermedios
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RespuestaDTO {
        private Integer idRespuesta;
        private String texto;
        private Boolean correcta;
    }
}