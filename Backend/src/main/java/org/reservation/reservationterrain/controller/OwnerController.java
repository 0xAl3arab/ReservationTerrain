package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.reservation.reservationterrain.service.OwnerService;
import org.reservation.reservationterrain.dto.OwnerRegistrationDTO;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerRepository ownerRepository;
    private final OwnerService ownerService;

    public OwnerController(OwnerRepository ownerRepository, OwnerService ownerService) {
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
    }

    // Méthode pour qu'un utilisateur s'enregistre dans la BDD après son premier
    // login Keycloak
    @PostMapping("/register")
    public Owner completerProfil(@RequestBody Owner ownerInfo, @AuthenticationPrincipal Jwt token) {
        String email = token.getClaimAsString("email");
        ownerInfo.setEmail(email);
        return ownerRepository.save(ownerInfo);
    }

    @PostMapping("/create")
    public Owner createOwner(@RequestBody OwnerRegistrationDTO request) {
        return ownerService.createOwner(request);
    }

    @GetMapping
    public List<Owner> tousLesOwners() {
        return ownerRepository.findAll();
    }
}
