package org.reservation.reservationterrain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Annonce {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private LocalDateTime date;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Client client;

    @ManyToOne(optional = false)
    private Terrain terrain;

    private int nbrJoueur;

    public Annonce() {
    }
}