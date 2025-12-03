package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.model.Reservation;
import org.reservation.reservationterrain.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final OwnerService ownerService;

    public ReservationService(ReservationRepository reservationRepository, OwnerService ownerService) {
        this.reservationRepository = reservationRepository;
        this.ownerService = ownerService;
    }

    // Récupérer toutes les réservations des terrains de l'owner connecté
    public List<Reservation> getReservationsOwner(Jwt jwt) {
        Owner owner = ownerService.getCurrentOwner(jwt);
        return reservationRepository.findByOwnerId(owner.getId());
    }
}