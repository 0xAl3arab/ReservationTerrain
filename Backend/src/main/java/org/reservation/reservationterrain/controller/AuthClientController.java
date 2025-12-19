package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ClientLoginRequest;
import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.dto.TokenResponse;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.service.ClientLoginService;
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
    private final ClientLoginService clientLoginService;

    public AuthClientController(ClientSignupService clientSignupService,
                                ClientService clientService,
                                ClientLoginService clientLoginService) {
        this.clientSignupService = clientSignupService;
        this.clientService = clientService;
        this.clientLoginService = clientLoginService;
    }

    @PostMapping("/signup")
    public Client signup(@RequestBody ClientSignupRequest request) {
        return clientSignupService.signup(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody ClientLoginRequest request) {
        return clientLoginService.login(request);
    }

    @GetMapping("/me")
    public Client getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return clientService.getByEmail(email);
    }
}
