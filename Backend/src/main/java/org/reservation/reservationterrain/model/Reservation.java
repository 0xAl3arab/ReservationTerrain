package org.reservation.reservationterrain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // "CONFIRMEE", "ANNULEE"...
    @Column(nullable = false)
    private String status;

    // la journée de la réservation
    @Column(nullable = false)
    private LocalDate date;

    // heure de début (ex : 08:00)
    @Column(nullable = false)
    private LocalTime heureDebut;

    // heure de fin (ex : 09:00)
    @Column(nullable = false)
    private LocalTime heureFin;

    // durée en minutes (optionnel si tu peux la calculer avec début/fin)
    @Column(nullable = false)
    private int duree;

    @ManyToOne(optional = false)
    private Client client;

    @ManyToOne(optional = false)
    private Terrain terrain;
}
