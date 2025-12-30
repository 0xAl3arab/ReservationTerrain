package org.reservation.reservationterrain.repository;

import java.util.Optional;

import org.reservation.reservationterrain.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByEmail(String email);
}
