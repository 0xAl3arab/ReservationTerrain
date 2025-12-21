package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Récupère toutes les réservations des terrains appartenant au Owner connecté
    @Query("SELECT r FROM Reservation r WHERE r.terrain.complexe.owner.keycloakId = :keycloakId")
    List<Reservation> findByOwnerKeycloakId(@Param("keycloakId") String keycloakId);
}