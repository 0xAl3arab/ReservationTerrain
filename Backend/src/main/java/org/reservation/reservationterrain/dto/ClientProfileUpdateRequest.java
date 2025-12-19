package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class ClientProfileUpdateRequest {
    private String nom;
    private String prenom;
    private String email;
    private String numTele;
}
