package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "partidas")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre_usuario", unique = true, nullable = false) // Aseguramos el mapeo snake_case de tu BD
    private String nombreUsuario;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;

    @Column(name = "mejor_tiempo")
    private LocalTime mejorTiempo;

    @Column(name = "puntos_maximos")
    private Integer puntosMaximos;

    // Añade las comillas invertidas ` ` dentro de las comillas dobles
    @Column(name = "is_admin")
    private Boolean isAdmin;

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY) // MappedBy apunta a la variable 'usuario' de Partida
    @JsonManagedReference
    private List<Partida> partidas;

    @Column(name = "token_recuperacion")
    private String tokenRecuperacion;

}