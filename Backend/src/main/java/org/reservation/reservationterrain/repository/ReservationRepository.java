package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Find all reservations for a specific terrain on a specific date
    List<Reservation> findByTerrainIdAndDate(Long terrainId, LocalDate date);

    // Check for overlapping reservations
    // Two time ranges overlap if: start1 < end2 AND start2 < end1
    @Query("SELECT r FROM Reservation r WHERE r.terrain.id = :terrainId " +
            "AND r.date = :date " +
            "AND r.heureDebut < :heureFin " +
            "AND r.heureFin > :heureDebut " +
            "AND r.status != 'ANNULEE'")
    List<Reservation> findOverlappingReservations(
            @Param("terrainId") Long terrainId,
            @Param("date") LocalDate date,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin);
}
