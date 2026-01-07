package org.reservation.reservationterrain.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ReservationDTO {
    private Long id;
    private String status;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private int duree;

    // Client details
    private String clientNom;
    private String clientPrenom;
    private String clientNumTele;

    // Terrain details
    private String terrainNom;
    private String prixTerrain;
}
