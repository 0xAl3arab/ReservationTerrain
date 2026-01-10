package org.reservation.reservationterrain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OwnerProfileDTO {
    private String nom;
    private String prenom;
    private String email;
    private String numTele;
    private String nomComplexe;
    private String ville;
    private String adresse;
}
