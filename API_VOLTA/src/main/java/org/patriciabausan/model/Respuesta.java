package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "respuestas") // Forzamos a que apunte a la tabla en plural de MySQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta") // 1. Mapea con la clave primaria real de tu BD
    private Integer id;

    @Column(name = "texto_respuesta", nullable = false)
    private String texto;

    @Column(nullable = false) // En MySQL suele mapearse como tinyint/boolean
    private boolean correcta;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_pregunta") // 3. ¡ESTA ES LA CLAVE! Tu columna foránea se llama id_pregunta
    private Pregunta pregunta;
}