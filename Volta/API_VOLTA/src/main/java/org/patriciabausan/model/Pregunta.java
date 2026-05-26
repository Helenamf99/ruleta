package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "preguntas") // Aseguramos que apunte a la tabla en plural como la tienes en Workbench
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pregunta") // 1. ¡CORREGIDO! Mapea con el nombre real de tu clave primaria
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT") // 2. ¡CORREGIDO! En tu BD es tipo 'text', no 'varchar'
    private String enunciado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_cat") // 3. ¡CORREGIDO! Mapea con la columna real de unión
    private Categoria categoria;

    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL)
    private List<Respuesta> respuestas;
}