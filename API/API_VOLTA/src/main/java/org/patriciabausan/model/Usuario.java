package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.*;

import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "partidas")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String nombreUsuario;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nombreCompleto;

    private LocalDateTime fechaRegistro;

    private LocalTime mejorTiempo;

    private Integer puntosMaximos;

    @OneToMany(mappedBy = "usuario")
    private List<Partida> partidas;
}