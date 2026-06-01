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
    private String letra;
    private Integer categoriaId;
    private String categoriaNombre;
    private String respuestaCorrecta;
    private List<String> opciones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RespuestaDTO {
        private Integer idRespuesta;
        private String texto;
        private Boolean correcta;
    }
}