package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.reservation.reservationterrain.service.OwnerService;
import org.reservation.reservationterrain.dto.*;
import org.reservation.reservationterrain.model.Terrain;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    // --- PROFIL ---
    @GetMapping("/profile")
    public ResponseEntity<OwnerProfileDTO> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(ownerService.getOwnerProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@AuthenticationPrincipal Jwt jwt,
            @RequestBody OwnerProfileDTO profileDTO) {
        String email = jwt.getClaimAsString("email");
        ownerService.updateOwnerProfile(email, profileDTO);
        return ResponseEntity.ok("Profil mis à jour");
    }

    // --- TERRAINS ---
    @PostMapping("/terrains")
    public ResponseEntity<Terrain> addTerrain(@RequestBody TerrainDTO terrainDTO, @AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(ownerService.addTerrain(email, terrainDTO));
    }

    @GetMapping("/terrains")
    public List<TerrainDTO> getMyTerrains(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ownerService.getMyTerrains(email);
    }

    @PutMapping("/terrains/{id}")
    public ResponseEntity<Terrain> updateTerrain(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id,
            @RequestBody TerrainDTO terrainDTO) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(ownerService.updateTerrain(email, id, terrainDTO));
    }

    // --- RÉSERVATIONS (Nouveau) ---
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDTO>> getReservations(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(ownerService.getReservations(email));
    }

    @PutMapping("/reservations/{id}/validate")
    public ResponseEntity<String> validate(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String email = jwt.getClaimAsString("email");
        ownerService.validateReservation(email, id);
        return ResponseEntity.ok("Réservation validée");
    }

    @PutMapping("/reservations/{id}/cancel")
    public ResponseEntity<String> cancel(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String email = jwt.getClaimAsString("email");
        ownerService.cancelReservation(email, id);
        return ResponseEntity.ok("Réservation annulée");
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<OwnerDashboardStatsDTO> getDashboardStats(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(ownerService.getDashboardStats(email));
    }
}