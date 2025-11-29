package org.reservation.reservationterrain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "terrains")
public class Terrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;       // Ex: "Terrain A", "Stade Central"
    private String adresse;
    private Double prixHeure; // Ex: 300.0
    private String type;      // Ex: "5x5", "7x7", "11x11"
    private String photoUrl;  // Lien vers une image (optionnel)

    // RELATION : Un terrain appartient à un seul Owner
    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnore // Pour éviter une boucle infinie quand on transforme en JSON
    private Owner owner;
}