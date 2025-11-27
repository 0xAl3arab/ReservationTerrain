package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.service.ClientService;
import org.reservation.reservationterrain.service.ClientSignupService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/client")
public class AuthClientController {

    private final ClientSignupService clientSignupService;
    private final ClientService clientService;

    public AuthClientController(ClientSignupService clientSignupService,
                                ClientService clientService) {
        this.clientSignupService = clientSignupService;
        this.clientService = clientService;
    }

    @PostMapping("/signup")
    public Client signup(@RequestBody ClientSignupRequest request) {
        return clientSignupService.signup(request);
    }

    @GetMapping("/login")
    public Client login(@AuthenticationPrincipal Jwt jwt) {
        System.out.println(jwt.getClaims()); // pour debug
        String email = jwt.getClaimAsString("email"); // adapte si besoin
        return clientService.getByEmail(email);
    }
}
