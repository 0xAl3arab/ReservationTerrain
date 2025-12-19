package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.ComplexeRequest;
import org.reservation.reservationterrain.dto.ComplexeResponse;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.ComplexeRepository;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplexeService {

    private final ComplexeRepository complexeRepository;
    private final OwnerRepository ownerRepository;

    public ComplexeService(ComplexeRepository complexeRepository, OwnerRepository ownerRepository) {
        this.complexeRepository = complexeRepository;
        this.ownerRepository = ownerRepository;
    }

    // =========================================================
    // PARTIE CLIENT (Celle qui manquait et causait l'erreur)
    // =========================================================

    /**
     * Récupère tous les complexes (pour l'affichage public coté client)
     */
    public List<ComplexeResponse> getAllComplexes() {
        return complexeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // PARTIE OWNER (Tes fonctionnalités)
    // =========================================================

    /**
     * Récupère uniquement les complexes du propriétaire connecté.
     */
    public List<ComplexeResponse> getMyComplexes(String keycloakId) {
        Owner owner = ownerRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("Propriétaire non trouvé (Keycloak ID: " + keycloakId + ")"));

        return complexeRepository.findAll().stream()
                .filter(c -> c.getOwner().getId().equals(owner.getId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Crée un nouveau complexe lié au propriétaire.
     */
    public ComplexeResponse createComplexe(ComplexeRequest request, String keycloakId) {
        Owner owner = ownerRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("Erreur : Le propriétaire n'existe pas."));

        Complexe complexe = new Complexe();
        complexe.setNom(request.getNom());
        complexe.setVille(request.getVille());
        // On respecte l'orthographe du DTO
        complexe.setAdress(request.getAdress());

        complexe.setOwner(owner);

        Complexe savedComplexe = complexeRepository.save(complexe);
        return mapToResponse(savedComplexe);
    }

    // =========================================================
    // UTILITAIRES
    // =========================================================

    private ComplexeResponse mapToResponse(Complexe c) {
        ComplexeResponse dto = new ComplexeResponse();
        dto.setId(c.getId());
        dto.setNom(c.getNom());
        dto.setVille(c.getVille());
        dto.setAdress(c.getAdress());
        return dto;
    }
}