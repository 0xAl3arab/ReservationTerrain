package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class ComplexeRequest {
    private String nom;
    private String ville;
    // On garde l'orthographe "adress" pour correspondre à l'entité de ton collègue
    private String adress;
    private String description;
}