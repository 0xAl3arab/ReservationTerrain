package org.reservation.reservationterrain;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String bonjour() {
        return "Connexion réussie ! Si tu vois ce message, ton Token Keycloak est valide.";
    }
}
