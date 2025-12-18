package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.TerrainResponseDTO;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TerrainService {

    private final TerrainRepository terrainRepository;

    public TerrainService(TerrainRepository terrainRepository) {
        this.terrainRepository = terrainRepository;
    }

    public List<TerrainResponseDTO> getTerrainsByComplexe(Long complexeId) {
        List<Terrain> terrains = terrainRepository.findByComplexe_Id(complexeId);

        List<TerrainResponseDTO> terrainDtos = new ArrayList<>();

        for (Terrain t : terrains) {
            TerrainResponseDTO dto = new TerrainResponseDTO();
            dto.setId(t.getId());
            dto.setNom(t.getNom());
            dto.setPrixTerrain(t.getPrixTerrain());
            dto.setStatus(t.getStatus());
            dto.setHeureOuverture(t.getHeureOuverture());
            dto.setHeureFermeture(t.getHeureFermeture());

            terrainDtos.add(dto);
        }

        return terrainDtos;
    }
}
