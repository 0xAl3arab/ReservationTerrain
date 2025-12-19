package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class TerrainRequest {
    private String nom; // Ex: "Terrain A"
    private String prixTerrain; // Ex: "300" (String comme dans ton entité)
    private String status; // Ex: "DISPONIBLE"
    private int heureOuverture; // Ex: 9
    private int heureFermeture; // Ex: 23
    private int dureeCreneau; // Ex: 60 (minutes)
}