package org.reservation.reservationterrain.repository;

import java.util.List;

import org.reservation.reservationterrain.model.Complexe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplexeRepository extends JpaRepository<Complexe, Long> {
    List<Complexe> findAll();

    java.util.Optional<Complexe> findFirstByOwner(org.reservation.reservationterrain.model.Owner owner);
}
