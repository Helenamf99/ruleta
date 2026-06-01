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
@Table(name = "partidas") // Apunta perfecto a tu tabla plural
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida") // 🌟 Mapea con la PK real de tu BD
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_jugador", referencedColumnName = "id") // 🌟 Define que id_jugador se une con el id de usuarios
    @JsonBackReference
    private Usuario usuario;

    private Integer puntos;

    @Column(name = "tiempo_partida") // 🌟 Mapea con la columna real de tu BD
    private LocalTime tiempo;

    private LocalDateTime fecha = LocalDateTime.now();
}