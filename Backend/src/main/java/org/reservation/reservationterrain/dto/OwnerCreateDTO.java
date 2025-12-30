package org.reservation.reservationterrain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OwnerCreateDTO {
    private String email;
    private String nom;
    private String prenom;
    private String numTele;
    private String nomComplexe;
    private String nomComplexeFull;
    private String ville;
    private String adress;

}
