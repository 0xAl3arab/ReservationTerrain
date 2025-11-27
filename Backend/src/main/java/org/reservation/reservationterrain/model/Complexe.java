package org.reservation.reservationterrain.model;

import jakarta.persistence.*;      // IMPORTANT
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;        // IMPORTANT
import java.util.List;            // IMPORTANT

@Getter
@Setter
@Entity
@Table(name="complexe")
public class Complexe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String adress;

    @OneToOne(optional = false)
    private Owner owner;

    @OneToMany(mappedBy = "complexe")
    private List<Terrain> terrains = new ArrayList<>();
}
