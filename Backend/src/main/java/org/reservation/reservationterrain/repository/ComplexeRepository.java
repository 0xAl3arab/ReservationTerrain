package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Complexe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplexeRepository extends JpaRepository<Complexe, Long> {
    // pour l’instant rien à ajouter
}
