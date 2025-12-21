package org.reservation.reservationterrain.dto;

import lombok.Data;

@Data
public class OwnerDashboardStats {
    private long totalComplexes;
    private long totalTerrains;
    private long reservationsAujourdhui;
    // Tu peux ajouter d'autres champs plus tard (ex: chiffre d'affaires)
}