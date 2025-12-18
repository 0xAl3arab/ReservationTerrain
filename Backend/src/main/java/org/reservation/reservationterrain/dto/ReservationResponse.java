package org.reservation.reservationterrain.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationResponse {
    private Long id;
    private String status;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private int duree;

    // Terrain info
    private Long terrainId;
    private String terrainNom;

    // Client info
    private Long clientId;
    private String clientNom;
}
