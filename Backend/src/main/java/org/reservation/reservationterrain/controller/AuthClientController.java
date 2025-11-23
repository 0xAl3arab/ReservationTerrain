package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.service.ClientService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/client")
public class AuthClientController {

    private final ClientService clientService;

    public AuthClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/signup")
    public Client signup(@RequestBody ClientSignupRequest request) {
        return clientService.signup(request);
    }

    // LOGIN côté backend : qui est connecté ?
    @GetMapping("/me")
    public Client me(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return clientService.getByEmail(email);
    }
}
