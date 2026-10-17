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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

        // 0. Vérifier les doublons en base AVANT de créer le user Keycloak,
        // sinon on laisse un compte Keycloak orphelin quand l'insert échoue.
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
        }
        if (request.getNumTele() != null && !request.getNumTele().isBlank()
                && clientRepository.existsByNumTele(request.getNumTele())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce numéro de téléphone est déjà utilisé");
        }

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

        Response response;
        try {
            response = usersResource.create(user);
        } catch (Exception e) {
            // Le backend n'arrive pas à se connecter à l'API admin de Keycloak
            // (identifiants keycloak.username/password ou client admin-cli du realm master)
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Service d'inscription indisponible (connexion à Keycloak impossible)", e);
        }
        if (response.getStatus() == 409) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
        }
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

        try {
            return clientRepository.save(client);
        } catch (RuntimeException e) {
            // Annule la création Keycloak pour que l'utilisateur puisse réessayer
            try {
                usersResource.get(keycloakId).remove();
            } catch (Exception cleanup) {
                System.err.println("Could not remove Keycloak user " + keycloakId + ": " + cleanup.getMessage());
            }
            throw e;
        }
    }
}
