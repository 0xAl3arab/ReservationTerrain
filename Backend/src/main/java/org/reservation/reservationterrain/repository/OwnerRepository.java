package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

    // Cette méthode magique permet de trouver le Owner via l'ID stocké dans
    // Keycloak
    Optional<Owner> findByKeycloakId(String keycloakId);
}