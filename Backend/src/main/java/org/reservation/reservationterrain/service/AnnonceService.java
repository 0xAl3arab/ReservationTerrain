package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.AnnonceDTO;
import org.reservation.reservationterrain.model.Annonce;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.AnnonceRepository;
import org.reservation.reservationterrain.repository.ClientRepository;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnonceService {

    @Autowired
    private AnnonceRepository annonceRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    public AnnonceDTO createAnnonce(AnnonceDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Terrain terrain = terrainRepository.findById(dto.getTerrainId())
                .orElseThrow(() -> new RuntimeException("Terrain not found"));

        Annonce annonce = new Annonce();
        annonce.setDate(LocalDateTime.now());
        annonce.setNbrJoueur(dto.getNbrJoueur());
        annonce.setClient(client);
        annonce.setTerrain(terrain);

        Annonce saved = annonceRepository.save(annonce);
        return mapToDTO(saved);
    }

    public List<AnnonceDTO> getAllAnnonces() {
        return annonceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AnnonceDTO> getAnnoncesByCity(String city) {
        return annonceRepository.findByTerrain_Complexe_Ville(city).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AnnonceDTO> getAnnoncesByTerrain(Long terrainId) {
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain not found"));
        return annonceRepository.findByTerrain(terrain).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AnnonceDTO mapToDTO(Annonce annonce) {
        AnnonceDTO dto = new AnnonceDTO();
        dto.setId(annonce.getId());
        dto.setDate(annonce.getDate());
        dto.setNbrJoueur(annonce.getNbrJoueur());
        
        dto.setClientId(annonce.getClient().getId());
        dto.setClientName(annonce.getClient().getNom() + " " + annonce.getClient().getPrenom());
        
        dto.setTerrainId(annonce.getTerrain().getId());
        dto.setTerrainName(annonce.getTerrain().getNom());
        dto.setComplexeName(annonce.getTerrain().getComplexe().getNom());
        dto.setVille(annonce.getTerrain().getComplexe().getVille());
        
        return dto;
    }
}
