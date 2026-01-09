package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Annonce;
import org.reservation.reservationterrain.model.Terrain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Integer> {
    List<Annonce> findByTerrain_Complexe_Ville(String ville);
    List<Annonce> findByTerrain(Terrain terrain);
}
