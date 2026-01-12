package org.reservation.reservationterrain.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnonceDTO {
    private int id;
    private LocalDateTime date;
    private int nbrJoueur;

    // Client info
    private Long clientId;
    private String clientName;
    private String clientPhone;

    // Terrain info
    private Long terrainId;
    private String terrainName;
    private String complexeName;
    private String ville;
}
