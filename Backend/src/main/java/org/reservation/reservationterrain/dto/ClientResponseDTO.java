package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class ClientResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String numTele;
}
