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

        List<Reservation> findByTerrainIdAndDate(Long terrainId, LocalDate date);

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

        @Query("SELECT r FROM Reservation r WHERE r.terrain.id = :terrainId " +
                        "AND r.date = :date " +
                        "AND r.heureDebut < :heureFin " +
                        "AND r.heureFin > :heureDebut " +
                        "AND r.status != 'ANNULEE' " +
                        "AND r.id != :excludeId")
        List<Reservation> findOverlappingReservationsExcludingId(
                        @Param("terrainId") Long terrainId,
                        @Param("date") LocalDate date,
                        @Param("heureDebut") LocalTime heureDebut,
                        @Param("heureFin") LocalTime heureFin,
                        @Param("excludeId") Long excludeId);

        List<Reservation> findByDateBetween(LocalDate startDate, LocalDate endDate);

        long countByDateBetween(LocalDate startDate, LocalDate endDate);

        @Query("SELECT r FROM Reservation r WHERE " +
                        "(:complexId IS NULL OR r.terrain.complexe.id = :complexId) AND " +
                        "(:clientId IS NULL OR r.client.id = :clientId) AND " +
                        "(:dateFrom IS NULL OR r.date >= :dateFrom) AND " +
                        "(:dateTo IS NULL OR r.date <= :dateTo) AND " +
                        "(:status IS NULL OR r.status = :status) AND " +
                        "(:minDuration IS NULL OR r.duree >= :minDuration) AND " +
                        "(:maxDuration IS NULL OR r.duree <= :maxDuration)")
        List<Reservation> findReservationsByFilters(
                        @Param("complexId") Long complexId,
                        @Param("clientId") Long clientId,
                        @Param("dateFrom") LocalDate dateFrom,
                        @Param("dateTo") LocalDate dateTo,
                        @Param("status") String status,
                        @Param("minDuration") Integer minDuration,
                        @Param("maxDuration") Integer maxDuration);

        List<Reservation> findByClientId(Long clientId);

}
