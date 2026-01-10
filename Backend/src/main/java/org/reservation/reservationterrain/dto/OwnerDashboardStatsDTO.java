package org.reservation.reservationterrain.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OwnerDashboardStatsDTO {
    private double totalRevenue;
    private long totalReservations;
    private long activeTerrains;
    private long pendingReservations;
    private List<ReservationDTO> recentReservations;
}
