package org.reservation.reservationterrain.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationResponse {
    private Long id;
    private String nomClient;     // Pour afficher "Ahmed Dupont"
    private String nomTerrain;
    private String nomComplexe;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String status;        // CONFIRMEE, ANNULEE...
}