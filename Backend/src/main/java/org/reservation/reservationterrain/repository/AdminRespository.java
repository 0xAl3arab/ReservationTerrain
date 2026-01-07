package org.reservation.reservationterrain.repository;

import org.reservation.reservationterrain.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRespository extends JpaRepository<Client, Long> {
}
