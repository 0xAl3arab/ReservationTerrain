package org.reservation.reservationterrain.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.reservation.reservationterrain.dto.PasswordChangeRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class PasswordChangeService {

    private final Keycloak keycloak;
    private final String realm;
    private final ClientRepository clientRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${keycloak.server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.client-id:admin-cli}")
    private String clientId;

    public PasswordChangeService(Keycloak keycloak,
                                  @Value("${keycloak.realm}") String realm,
                                  ClientRepository clientRepository) {
        this.keycloak = keycloak;
        this.realm = realm;
        this.clientRepository = clientRepository;
    }

    public void changePassword(String email, PasswordChangeRequest request) {
        // 1. Verify current password by attempting to authenticate
        if (!verifyCurrentPassword(email, request.getCurrentPassword())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        // 2. Get client from database to find Keycloak ID
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        if (client.getKeycloakId() == null) {
            throw new RuntimeException("Keycloak ID non trouvé pour ce client");
        }

        // 3. Update password in Keycloak
        try {
            UserResource userResource = keycloak.realm(realm)
                    .users()
                    .get(client.getKeycloakId());

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(request.getNewPassword());
            credential.setTemporary(false);

            userResource.resetPassword(credential);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du changement de mot de passe: " + e.getMessage());
        }
    }

    private boolean verifyCurrentPassword(String email, String password) {
        String tokenUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", clientId);
        body.add("username", email);
        body.add("password", password);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
}
