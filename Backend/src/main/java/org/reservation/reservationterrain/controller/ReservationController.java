package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.model.Reservation;
import org.reservation.reservationterrain.service.ReservationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // L'owner regarde son planning
    @GetMapping("/owner")
    public List<Reservation> getMesReservations(@AuthenticationPrincipal Jwt jwt) {
        return reservationService.getReservationsOwner(jwt);
    }
}