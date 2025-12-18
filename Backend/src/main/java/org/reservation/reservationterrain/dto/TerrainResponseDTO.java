package org.reservation.reservationterrain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class TerrainResponseDTO {
    private long id;
    private String nom;
    private String prixTerrain;
    private String status;
    private int heureOuverture;
    private int heureFermeture;

    public TerrainResponseDTO() {
    }
}
