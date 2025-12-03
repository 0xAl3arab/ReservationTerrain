package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Requête SQL intelligente : Trouve les réservations dont le terrain appartient
    // à l'Owner donné
    @Query("SELECT r FROM Reservation r WHERE r.terrain.owner.id = :ownerId")
    List<Reservation> findByOwnerId(@Param("ownerId") Long ownerId);
}