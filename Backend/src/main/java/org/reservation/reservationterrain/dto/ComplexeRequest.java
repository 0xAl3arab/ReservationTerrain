package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class ComplexeRequest {
    private String nom;
    private String ville;
    private String adress;
    private Long ownerId;
}
