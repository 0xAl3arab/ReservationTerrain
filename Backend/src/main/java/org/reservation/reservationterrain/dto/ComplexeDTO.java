package org.reservation.reservationterrain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplexeDTO {
    private String nom;
    private String ville;
    private String adress;
}
