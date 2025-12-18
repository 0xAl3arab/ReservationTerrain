package org.reservation.reservationterrain.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationRequest {
    private Long terrainId;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
}
