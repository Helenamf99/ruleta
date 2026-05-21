package org.patriciabausan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cat") // <- Apunta a la columna real de tu compañero
    private Integer id;      // <- Se llama 'id' para que tu repositorio funcione perfectamente

    @Column(name = "nombre_cat", nullable = false, unique = true) // <- Apunta al nombre real
    private String nombre;
}