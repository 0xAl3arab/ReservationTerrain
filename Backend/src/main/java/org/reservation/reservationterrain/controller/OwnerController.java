package org.reservation.reservationterrain.controller;

import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.service.OwnerService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner") // Point d'entrée de l'API : http://localhost:8080/api/owner
@CrossOrigin(origins = "http://localhost:5173") // Autorise le Frontend React à discuter avec nous
public class OwnerController {

    private final OwnerService ownerService;

    // Injection du Service (La logique métier)
    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    /**
     * GET /api/owner/profile
     * Appelé quand l'Owner arrive sur sa page de profil.
     * Le @AuthenticationPrincipal Jwt jwt récupère automatiquement le token envoyé
     * par React.
     */
    @GetMapping("/profile")
    public Owner getProfile(@AuthenticationPrincipal Jwt jwt) {
        // Le service va chercher l'owner ou le CRÉER automatiquement s'il n'existe pas
        return ownerService.getCurrentOwner(jwt);
    }

    /**
     * PUT /api/owner/profile
     * Appelé quand l'Owner clique sur "Sauvegarder" après avoir changé son nom de
     * stade ou tel.
     */
    @PutMapping("/profile")
    public Owner updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody Owner ownerInfos) {
        // On demande au service de mettre à jour les infos
        return ownerService.updateOwner(jwt, ownerInfos);
    }
}