package org.reservation.reservationterrain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientSignupRequest {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String numTele;
}
