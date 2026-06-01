package org.patriciabausan.repository;

import org.patriciabausan.model.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreguntaRepository extends JpaRepository<Pregunta, Integer> {
    List<Pregunta> findByCategoriaId(Integer categoriaId);
}