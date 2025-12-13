package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ClientProfileUpdateRequest;
import org.reservation.reservationterrain.dto.ClientResponseDTO;
import org.reservation.reservationterrain.dto.PasswordChangeRequest;
import org.reservation.reservationterrain.service.ClientService;
import org.reservation.reservationterrain.service.PasswordChangeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/client")
public class ClientController {

    private final ClientService clientService;
    private final PasswordChangeService passwordChangeService;

    public ClientController(ClientService clientService,
                            PasswordChangeService passwordChangeService) {
        this.clientService = clientService;
        this.passwordChangeService = passwordChangeService;
    }

    // Récupération du profil
    @GetMapping("/profile")
    public ClientResponseDTO getProfile(@AuthenticationPrincipal Jwt jwt) {
        return clientService.getCurrentClientProfile(jwt);
    }

    // Mise à jour du profil
    @PutMapping("/profile")
    public ClientResponseDTO updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ClientProfileUpdateRequest request
    ) {
        return clientService.updateProfile(jwt, request);
    }

    // Changement de mot de passe
    @PutMapping("/password")
    public void changePassword(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody PasswordChangeRequest request
    ) {
        String email = jwt.getClaimAsString("email");
        passwordChangeService.changePassword(email, request);
    }
}
