package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class ComplexeResponse {
    private Long id;
    private String nom;
    private String ville;
    private String adress;
    private OwnerSummary owner;
    private java.util.List<TerrainResponseDTO> terrains;

    @Data
    public static class OwnerSummary {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
        private String numTele;
    }
}
