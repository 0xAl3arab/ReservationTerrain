package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ComplexeRequest;
import org.reservation.reservationterrain.dto.ComplexeResponse;
import org.reservation.reservationterrain.dto.TerrainRequest;
import org.reservation.reservationterrain.dto.TerrainResponse;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.reservation.reservationterrain.service.ComplexeService;
import org.reservation.reservationterrain.service.TerrainService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerRepository ownerRepository;
    private final ComplexeService complexeService;
    private final TerrainService terrainService; // Nouveau service ajouté

    // Injection des 3 dépendances via le constructeur
    public OwnerController(OwnerRepository ownerRepository,
            ComplexeService complexeService,
            TerrainService terrainService) {
        this.ownerRepository = ownerRepository;
        this.complexeService = complexeService;
        this.terrainService = terrainService;
    }

    // =========================================================
    // 1. GESTION DU PROFIL
    // =========================================================

    @PostMapping("/register")
    public Owner completerProfil(@RequestBody Owner ownerInfo, @AuthenticationPrincipal Jwt token) {
        String email = token.getClaimAsString("email");
        String keycloakId = token.getSubject();

        ownerInfo.setEmail(email);
        ownerInfo.setKeycloakId(keycloakId);

        return ownerRepository.save(ownerInfo);
    }

    @GetMapping
    public List<Owner> tousLesOwners() {
        return ownerRepository.findAll();
    }

    // =========================================================
    // 2. GESTION DES COMPLEXES
    // =========================================================

    @GetMapping("/complexes")
    public ResponseEntity<List<ComplexeResponse>> getMyComplexes(@AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        return ResponseEntity.ok(complexeService.getMyComplexes(keycloakId));
    }

    @PostMapping("/complexes")
    public ResponseEntity<ComplexeResponse> createComplexe(
            @RequestBody ComplexeRequest request,
            @AuthenticationPrincipal Jwt token) {

        String keycloakId = token.getSubject();
        ComplexeResponse response = complexeService.createComplexe(request, keycloakId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // =========================================================
    // 3. GESTION DES TERRAINS (NOUVEAU)
    // =========================================================

    /**
     * Ajouter un terrain dans un complexe spécifique
     * URL : POST /api/owners/complexes/{complexeId}/terrains
     */
    @PostMapping("/complexes/{complexeId}/terrains")
    public ResponseEntity<TerrainResponse> addTerrain(
            @PathVariable Long complexeId,
            @RequestBody TerrainRequest request,
            @AuthenticationPrincipal Jwt token) {

        String keycloakId = token.getSubject();

        // Le service s'occupe de vérifier que le complexe appartient bien à ce Owner
        TerrainResponse response = terrainService.addTerrain(complexeId, request, keycloakId);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Voir les terrains d'un complexe spécifique
     * URL : GET /api/owners/complexes/{complexeId}/terrains
     */
    @GetMapping("/complexes/{complexeId}/terrains")
    public ResponseEntity<List<TerrainResponse>> getTerrainsByComplexe(
            @PathVariable Long complexeId,
            @AuthenticationPrincipal Jwt token) {

        String keycloakId = token.getSubject();
        return ResponseEntity.ok(terrainService.getTerrainsByComplexe(complexeId, keycloakId));
    }
}