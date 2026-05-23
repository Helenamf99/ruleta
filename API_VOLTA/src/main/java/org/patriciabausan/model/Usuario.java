package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "usuarios") // Mantiene apuntando a tu tabla en plural
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
    private String nombreUsuario; // Spring mapeará esto automáticamente a nombre_usuario en la BD

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nombreCompleto;

    private LocalDate fechaRegistro;

    private LocalTime mejorTiempo;

    private Integer puntosMaximos;

    private Boolean isAdmin;

    @OneToMany(mappedBy = "usuario")
    private List<Partida> partidas;
}