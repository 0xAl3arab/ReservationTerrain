package org.reservation.reservationterrain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "terrain")
public class Terrain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String prixTerrain;
    private String nom;
    @ManyToOne(optional = false)
    private Complexe complexe;
    private String status;
    private int heureOuverture;
    private int heureFermeture;
    private int dureeCreneau;

    public Terrain() {
    }
}