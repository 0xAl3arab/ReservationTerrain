package org.reservation.reservationterrain.repository;

import java.util.List;

import org.reservation.reservationterrain.model.Complexe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplexeRepository extends JpaRepository<Complexe, Long> {
    List<Complexe> findAll();
}
