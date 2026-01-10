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

import java.time.LocalDate;
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

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal Jwt jwt,
            @RequestBody PasswordChangeRequest request) {
        try {
            String email = jwt.getClaimAsString("email");
            System.out.println("DEBUG: change-password request for: " + email);
            System.out.println("DEBUG: JWT Claims: " + jwt.getClaims());
            ownerService.changePassword(email, request);
            return ResponseEntity.ok("Mot de passe mis à jour avec succès");
        } catch (Exception e) {
            System.err.println("DEBUG: change-password controller error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/complexe")
    public ResponseEntity<String> updateComplexe(@AuthenticationPrincipal Jwt jwt,
            @RequestBody ComplexeDTO complexeDTO) {
        try {
            String email = jwt.getClaimAsString("email");
            ownerService.updateOwnerComplexe(email, complexeDTO);
            return ResponseEntity.ok("Informations du complexe mises à jour");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
    public ResponseEntity<List<ReservationDTO>> getReservations(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long terrainId,
            @RequestParam(required = false) LocalDate date) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(ownerService.getReservations(email, terrainId, date));
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