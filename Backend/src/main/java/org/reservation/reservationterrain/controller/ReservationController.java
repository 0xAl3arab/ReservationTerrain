package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ReservationRequest;
import org.reservation.reservationterrain.dto.ReservationResponse;
import org.reservation.reservationterrain.service.ReservationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> createReservation(
            @RequestBody ReservationRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            // Extract Keycloak ID from JWT token
            String keycloakId = jwt.getSubject();

            ReservationResponse response = reservationService.createReservation(request, keycloakId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            // Validation errors (terrain not found, invalid time range, etc.)
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            // Business logic errors (overlapping reservation)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // Unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Une erreur inattendue s'est produite"));
        }
    }

    @GetMapping("/terrains/{terrainId}/reservations")
    public ResponseEntity<List<ReservationResponse>> getTerrainReservations(
            @PathVariable Long terrainId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        // Default to today if no date provided
        LocalDate searchDate = date != null ? date : LocalDate.now();

        List<ReservationResponse> reservations = reservationService.getReservationsByTerrain(terrainId, searchDate);
        return ResponseEntity.ok(reservations);
    }

    // Simple error response class
    private static class ErrorResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
