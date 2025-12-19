package org.reservation.reservationterrain.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientSignupService {

    private final Keycloak keycloak;
    private final String realm;
    private final ClientRepository clientRepository;

    public ClientSignupService(Keycloak keycloak,
                               String keycloakRealmName,
                               ClientRepository clientRepository) {
        this.keycloak = keycloak;
        this.realm = keycloakRealmName;
        this.clientRepository = clientRepository;
    }

    public Client signup(ClientSignupRequest request) {

        // 1. Créer user Keycloak
        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getPrenom());
        user.setLastName(request.getNom());
        user.setEnabled(true);

        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setType(CredentialRepresentation.PASSWORD);
        cred.setValue(request.getPassword());
        cred.setTemporary(false);
        user.setCredentials(List.of(cred));

        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        Response response = usersResource.create(user);
        if (response.getStatus() >= 300) {
            throw new RuntimeException("Erreur création user Keycloak: " + response.getStatus());
        }

        String keycloakId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        // 1.5 Assign Role CLIENT
        try {
            var roleRepresentation = realmResource.roles().get("CLIENT").toRepresentation();
            usersResource.get(keycloakId).roles().realmLevel().add(List.of(roleRepresentation));
        } catch (Exception e) {
            // Log but don't fail, or fail if role is critical
            System.err.println("Warning: Could not assign CLIENT role: " + e.getMessage());
        }

        // 2. Créer Client en base
        Client client = new Client();
        client.setKeycloakId(keycloakId);
        client.setEmail(request.getEmail());
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setNumTele(request.getNumTele());
        client.setRole("CLIENT");

        return clientRepository.save(client);
    }
}
