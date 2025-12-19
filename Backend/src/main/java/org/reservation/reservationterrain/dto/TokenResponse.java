package org.reservation.reservationterrain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String access_token;
    private String refresh_token;
    private String token_type;
    private int expires_in;
}
