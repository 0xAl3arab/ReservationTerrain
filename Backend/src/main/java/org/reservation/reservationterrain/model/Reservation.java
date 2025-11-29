package org.reservation.reservationterrain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    private LocalDateTime dateHeureDebut; // Ex: 2024-11-30 14:00
    private LocalDateTime dateHeureFin;   // Ex: 2024-11-30 15:00
    
    private String statut; // "EN_ATTENTE", "CONFIRMEE", "ANNULEE"

    // RELATIONS
    
    @ManyToOne
    @JoinColumn(name = "terrain_id")
    private Terrain terrain;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client; // Ton collègue devra avoir créé la classe Client !
}