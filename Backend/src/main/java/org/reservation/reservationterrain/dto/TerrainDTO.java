package org.reservation.reservationterrain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TerrainDTO {
    private Long id;
    private String nom;
    private String prixTerrain;
    private String status;
    private Integer heureOuverture;
    private Integer heureFermeture;
    private Integer dureeCreneau;
}
