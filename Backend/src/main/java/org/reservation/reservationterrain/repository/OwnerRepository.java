package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    // Il trouve le keycloakId car Owner hérite de User
    Optional<Owner> findByKeycloakId(String keycloakId);

    // Utile pour la connexion
    Optional<Owner> findByEmail(String email);
}