package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class TerrainResponse {
    private Long id;
    private String nom;
    private String prixTerrain;
    private String status;
    private int heureOuverture;
    private int heureFermeture;
    private int dureeCreneau;
    private Long complexeId; // Utile pour savoir à quel complexe il appartient
}