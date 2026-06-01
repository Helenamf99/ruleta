package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "partidas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_jugador", referencedColumnName = "id")
    @JsonBackReference
    private Usuario usuario;

    private Integer puntos;

    @Column(name = "tiempo_partida")
    private LocalTime tiempo;

    private LocalDateTime fecha = LocalDateTime.now();
}