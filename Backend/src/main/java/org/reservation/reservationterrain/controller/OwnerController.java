package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.*;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.model.Reservation;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.reservation.reservationterrain.repository.ReservationRepository;
import org.reservation.reservationterrain.service.ComplexeService;
import org.reservation.reservationterrain.service.TerrainService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerRepository ownerRepository;
    private final ComplexeService complexeService;
    private final TerrainService terrainService;
    private final ReservationRepository reservationRepository;

    public OwnerController(OwnerRepository ownerRepository,
            ComplexeService complexeService,
            TerrainService terrainService,
            ReservationRepository reservationRepository) {
        this.ownerRepository = ownerRepository;
        this.complexeService = complexeService;
        this.terrainService = terrainService;
        this.reservationRepository = reservationRepository;
    }

    // --- 1. PROFIL ---
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

    // --- 2. COMPLEXES ---
    @GetMapping("/complexes")
    public ResponseEntity<List<ComplexeResponse>> getMyComplexes(@AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        return ResponseEntity.ok(complexeService.getMyComplexes(keycloakId));
    }

    @PostMapping("/complexes")
    public ResponseEntity<ComplexeResponse> createComplexe(@RequestBody ComplexeRequest request,
            @AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        ComplexeResponse response = complexeService.createComplexe(request, keycloakId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // NOUVEAU : SUPPRESSION
    @DeleteMapping("/complexes/{id}")
    public ResponseEntity<Void> deleteComplexe(@PathVariable Long id, @AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        complexeService.deleteComplexe(id, keycloakId);
        return ResponseEntity.noContent().build();
    }

    // --- 3. DASHBOARD ---
    @GetMapping("/dashboard-stats")
    public ResponseEntity<OwnerDashboardStats> getDashboardStats(@AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        List<ComplexeResponse> mesComplexes = complexeService.getMyComplexes(keycloakId);

        long nbComplexes = mesComplexes.size();
        long nbTerrains = 0;
        for (ComplexeResponse c : mesComplexes) {
            nbTerrains += terrainService.getTerrainsByComplexe(c.getId(), keycloakId).size();
        }

        long nbReservations = 0;
        try {
            nbReservations = reservationRepository.findByOwnerKeycloakId(keycloakId).size();
        } catch (Exception e) {
        }

        OwnerDashboardStats stats = new OwnerDashboardStats();
        stats.setTotalComplexes(nbComplexes);
        stats.setTotalTerrains(nbTerrains);
        stats.setReservationsAujourdhui(nbReservations);

        return ResponseEntity.ok(stats);
    }

    // --- 4. TERRAINS ---
    @PostMapping("/complexes/{complexeId}/terrains")
    public ResponseEntity<TerrainResponse> addTerrain(@PathVariable Long complexeId,
            @RequestBody TerrainRequest request, @AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        TerrainResponse response = terrainService.addTerrain(complexeId, request, keycloakId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/complexes/{complexeId}/terrains")
    public ResponseEntity<List<TerrainResponse>> getTerrainsByComplexe(@PathVariable Long complexeId,
            @AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        return ResponseEntity.ok(terrainService.getTerrainsByComplexe(complexeId, keycloakId));
    }

    // --- 5. RESERVATIONS ---
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(@AuthenticationPrincipal Jwt token) {
        String keycloakId = token.getSubject();
        List<Reservation> reservations = reservationRepository.findByOwnerKeycloakId(keycloakId);

        List<ReservationResponse> response = reservations.stream().map(r -> {
            ReservationResponse dto = new ReservationResponse();
            dto.setId(r.getId());
            dto.setDate(r.getDate());
            dto.setHeureDebut(r.getHeureDebut());
            dto.setHeureFin(r.getHeureFin());
            dto.setStatus(r.getStatus());
            dto.setNomTerrain(r.getTerrain().getNom());
            dto.setNomComplexe(r.getTerrain().getComplexe().getNom());
            if (r.getClient() != null) {
                dto.setNomClient(r.getClient().getPrenom() + " " + r.getClient().getNom());
            } else {
                dto.setNomClient("Client Inconnu");
            }
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}