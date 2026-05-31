package org.patriciabausan.repository;

import org.patriciabausan.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Integer> {
    List<Partida> findByUsuarioId(Integer usuarioId);
}
