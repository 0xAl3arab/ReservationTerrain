package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.List;

@Service
public class TerrainService {

    private final TerrainRepository terrainRepository;
    private final OwnerService ownerService; // On a besoin de savoir qui est connecté

    public TerrainService(TerrainRepository terrainRepository, OwnerService ownerService) {
        this.terrainRepository = terrainRepository;
        this.ownerService = ownerService;
    }

    // Ajouter un terrain pour l'owner connecté
    public Terrain ajouterTerrain(Jwt jwt, Terrain terrain) {
        Owner owner = ownerService.getCurrentOwner(jwt); // On récupère l'owner via le token
        terrain.setOwner(owner); // On lie le terrain à cet owner
        return terrainRepository.save(terrain);
    }

    // Voir mes terrains
    public List<Terrain> getMesTerrains(Jwt jwt) {
        Owner owner = ownerService.getCurrentOwner(jwt);
        return terrainRepository.findByOwnerId(owner.getId());
    }

    // Supprimer un terrain (seulement si c'est le mien)
    public void supprimerTerrain(Long id) {
        terrainRepository.deleteById(id);
    }
}