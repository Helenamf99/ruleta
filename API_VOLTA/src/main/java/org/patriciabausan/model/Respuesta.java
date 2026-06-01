package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "respuestas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta")
    private Integer id;

    @Column(name = "texto_respuesta", nullable = false)
    private String texto;

    @Column(nullable = false)
    private boolean correcta;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_pregunta")
    private Pregunta pregunta;
}