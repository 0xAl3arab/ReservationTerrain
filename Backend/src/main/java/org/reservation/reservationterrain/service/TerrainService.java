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

    // Mettre à jour un terrain existant
    public Terrain modifierTerrain(Long id, Terrain nouvellesInfos, Jwt jwt) {
        // 1. On récupère le propriétaire connecté
        Owner ownerConnecte = ownerService.getCurrentOwner(jwt);

        // 2. On cherche le terrain en base
        Terrain terrainExistant = terrainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        // 3. SÉCURITÉ : On vérifie que ce terrain appartient bien à cet owner
        if (!terrainExistant.getOwner().getId().equals(ownerConnecte.getId())) {
            throw new RuntimeException("Vous n'avez pas le droit de modifier ce terrain !");
        }

        // 4. On met à jour les champs
        terrainExistant.setNom(nouvellesInfos.getNom());
        terrainExistant.setType(nouvellesInfos.getType());
        terrainExistant.setPrixHeure(nouvellesInfos.getPrixHeure());
        terrainExistant.setAdresse(nouvellesInfos.getAdresse());
        terrainExistant.setPhotoUrl(nouvellesInfos.getPhotoUrl());

        // 5. On sauvegarde
        return terrainRepository.save(terrainExistant);
    }
}