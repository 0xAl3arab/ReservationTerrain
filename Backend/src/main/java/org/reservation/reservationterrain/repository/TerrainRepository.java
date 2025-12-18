package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Terrain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TerrainRepository extends JpaRepository<Terrain, Long> {

    List<Terrain> findByComplexe_Id(Long complexeId);
}
