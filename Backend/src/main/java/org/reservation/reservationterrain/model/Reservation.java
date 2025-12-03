package org.reservation.reservationterrain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Format de date : "2024-11-30 14:00"
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateHeureDebut;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateHeureFin;

    private String statut; // "CONFIRMEE", "ANNULEE", "EN_ATTENTE"

    // RELATION : Une réservation concerne UN terrain
    @ManyToOne
    @JoinColumn(name = "terrain_id")
    private Terrain terrain;

    // RELATION : Une réservation est faite par UN client
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}