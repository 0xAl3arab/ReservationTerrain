package org.reservation.reservationterrain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientLoginRequest {
    private String email;
    private String password;
}
