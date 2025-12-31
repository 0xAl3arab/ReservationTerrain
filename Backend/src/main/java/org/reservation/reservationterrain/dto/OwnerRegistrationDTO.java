package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class OwnerRegistrationDTO {
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String numTele;
}
