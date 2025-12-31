package org.reservation.reservationterrain.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.reservation.reservationterrain.dto.OwnerRegistrationDTO;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {

    private final Keycloak keycloak;
    private final String realm;
    private final OwnerRepository ownerRepository;

    public OwnerService(Keycloak keycloak,
            String keycloakRealmName,
            OwnerRepository ownerRepository) {
        this.keycloak = keycloak;
        this.realm = keycloakRealmName;
        this.ownerRepository = ownerRepository;
    }

    public Owner createOwner(OwnerRegistrationDTO request) {
        // 1. Create Keycloak user
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
            // If user already exists in Keycloak, we might want to handle it gracefully
            // For now, throw exception
            throw new RuntimeException(
                    "Erreur création user Keycloak: " + response.getStatus() + " " + response.getStatusInfo());
        }

        String keycloakId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        // 2. Assign Role OWNER
        try {
            var roleRepresentation = realmResource.roles().get("OWNER").toRepresentation();
            usersResource.get(keycloakId).roles().realmLevel().add(List.of(roleRepresentation));
        } catch (Exception e) {
            System.err.println("Warning: Could not assign OWNER role: " + e.getMessage());
        }

        // 3. Create Owner in DB
        Owner owner = new Owner();
        owner.setKeycloakId(keycloakId);
        owner.setEmail(request.getEmail());
        owner.setNom(request.getNom());
        owner.setPrenom(request.getPrenom());
        owner.setNumTele(request.getNumTele());
        owner.setRole("OWNER");

        return ownerRepository.save(owner);
    }
}
