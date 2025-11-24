package org.reservation.reservationterrain.dto;
import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
public class ClientSignupRequest {
    private String email;
    private String password;
    private String nom;
    private String prenom;
    private String numTele;
}
