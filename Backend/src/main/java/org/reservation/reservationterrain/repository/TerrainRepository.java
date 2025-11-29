package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Terrain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TerrainRepository extends JpaRepository<Terrain, Long> {
    // Trouver tous les terrains d'un owner spécifique
    List<Terrain> findByOwnerId(Long ownerId);
}
