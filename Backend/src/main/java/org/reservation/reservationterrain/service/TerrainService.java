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

    // --- Ajout pour le OWNER ---
    public TerrainResponse addTerrain(Long complexeId, TerrainRequest request, String keycloakId) {
        Complexe complexe = complexeRepository.findById(complexeId)
                .orElseThrow(() -> new RuntimeException("Complexe introuvable"));

        if (!complexe.getOwner().getKeycloakId().equals(keycloakId)) {
            throw new RuntimeException("Accès refusé : Ce complexe ne vous appartient pas.");
        }

        Terrain terrain = new Terrain();
        terrain.setNom(request.getNom());
        terrain.setPrixTerrain(request.getPrixTerrain());
        terrain.setStatus(request.getStatus());
        terrain.setHeureOuverture(request.getHeureOuverture());
        terrain.setHeureFermeture(request.getHeureFermeture());
        terrain.setDureeCreneau(request.getDureeCreneau());
        terrain.setComplexe(complexe);

        Terrain savedTerrain = terrainRepository.save(terrain);
        return mapToResponse(savedTerrain);
    }

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

    // --- NOUVEAU : Méthode publique pour le CLIENT (Pas de vérif Owner) ---
    public List<TerrainResponse> getTerrainsPublic(Long complexeId) {
        return terrainRepository.findByComplexeId(complexeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

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