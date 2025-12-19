package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.TerrainRequest;
import org.reservation.reservationterrain.dto.TerrainResponse;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.ComplexeRepository;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TerrainService {

    private final TerrainRepository terrainRepository;
    private final ComplexeRepository complexeRepository;

    public TerrainService(TerrainRepository terrainRepository, ComplexeRepository complexeRepository) {
        this.terrainRepository = terrainRepository;
        this.complexeRepository = complexeRepository;
    }

    /**
     * Ajouter un terrain dans un complexe spécifique
     */
    public TerrainResponse addTerrain(Long complexeId, TerrainRequest request, String keycloakId) {
        // 1. Récupérer le complexe
        Complexe complexe = complexeRepository.findById(complexeId)
                .orElseThrow(() -> new RuntimeException("Complexe introuvable"));

        // 2. SÉCURITÉ : Vérifier que ce complexe appartient bien au Owner connecté
        // On compare l'ID Keycloak du propriétaire du complexe avec celui du token
        if (!complexe.getOwner().getKeycloakId().equals(keycloakId)) {
            throw new RuntimeException("Accès refusé : Ce complexe ne vous appartient pas.");
        }

        // 3. Créer le terrain
        Terrain terrain = new Terrain();
        terrain.setNom(request.getNom());
        terrain.setPrixTerrain(request.getPrixTerrain());
        terrain.setStatus(request.getStatus());
        terrain.setHeureOuverture(request.getHeureOuverture());
        terrain.setHeureFermeture(request.getHeureFermeture());
        terrain.setDureeCreneau(request.getDureeCreneau());

        // Lier au complexe
        terrain.setComplexe(complexe);

        // 4. Sauvegarder
        Terrain savedTerrain = terrainRepository.save(terrain);

        return mapToResponse(savedTerrain);
    }

    /**
     * Voir les terrains d'un complexe (Sécurisé)
     */
    public List<TerrainResponse> getTerrainsByComplexe(Long complexeId, String keycloakId) {
        Complexe complexe = complexeRepository.findById(complexeId)
                .orElseThrow(() -> new RuntimeException("Complexe introuvable"));

        if (!complexe.getOwner().getKeycloakId().equals(keycloakId)) {
            throw new RuntimeException("Accès refusé.");
        }

        return terrainRepository.findByComplexeId(complexeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Utilitaire de mapping
    private TerrainResponse mapToResponse(Terrain t) {
        TerrainResponse dto = new TerrainResponse();
        dto.setId(t.getId());
        dto.setNom(t.getNom());
        dto.setPrixTerrain(t.getPrixTerrain());
        dto.setStatus(t.getStatus());
        dto.setHeureOuverture(t.getHeureOuverture());
        dto.setHeureFermeture(t.getHeureFermeture());
        dto.setDureeCreneau(t.getDureeCreneau());
        dto.setComplexeId(t.getComplexe().getId());
        return dto;
    }
}