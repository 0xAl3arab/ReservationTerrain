package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.dto.ClientProfileUpdateRequest;
import org.reservation.reservationterrain.dto.ClientResponseDTO;
import org.reservation.reservationterrain.service.ClientService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/client")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // Mise à jour du profil
    @PutMapping("/profile")
    public ClientResponseDTO updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ClientProfileUpdateRequest request
    ) {
        return clientService.updateProfile(jwt, request);
    }
}
