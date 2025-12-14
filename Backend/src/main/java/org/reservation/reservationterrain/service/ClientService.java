package org.reservation.reservationterrain.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.reservation.reservationterrain.dto.ClientProfileUpdateRequest;
import org.reservation.reservationterrain.dto.ClientResponseDTO;
import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final Keycloak keycloak;
    private final String realm;

    public ClientService(ClientRepository clientRepository,
            Keycloak keycloak,
            @Value("${keycloak.realm}") String realm) {
        this.clientRepository = clientRepository;
        this.keycloak = keycloak;
        this.realm = realm;
    }

    public Client signupLocal(ClientSignupRequest request) {
        clientRepository.findByEmail(request.getEmail())
                .ifPresent(c -> {
                    throw new RuntimeException("Email déjà utilisé");
                });

        Client client = new Client();
        client.setEmail(request.getEmail());
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setNumTele(request.getNumTele());
        client.setRole("CLIENT");

        return clientRepository.save(client);
    }

    public Client getByEmail(String email) {
        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

    // Récupère le profil à partir du JWT
    public ClientResponseDTO getCurrentClientProfile(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        Client client = getOrCreateFromJwt(jwt, email);
        return toResponseDTO(client);
    }

    // Mise à jour du profil avec synchronisation Keycloak
    @org.springframework.transaction.annotation.Transactional
    public ClientResponseDTO updateProfile(Jwt jwt, ClientProfileUpdateRequest request) {
        String email = jwt.getClaimAsString("email");
        Client client = getOrCreateFromJwt(jwt, email);

        // Update database
        if (request.getNom() != null)
            client.setNom(request.getNom());
        if (request.getPrenom() != null)
            client.setPrenom(request.getPrenom());
        if (request.getNumTele() != null)
            client.setNumTele(request.getNumTele());
        if (request.getEmail() != null)
            client.setEmail(request.getEmail());

        Client saved = clientRepository.save(client);

        // Sync with Keycloak
        if (client.getKeycloakId() != null) {
            syncToKeycloak(client);
        }

        return toResponseDTO(saved);
    }

    // Synchronize profile changes to Keycloak
    private void syncToKeycloak(Client client) {
        UserResource userResource = keycloak.realm(realm)
                .users()
                .get(client.getKeycloakId());

        UserRepresentation user = userResource.toRepresentation();
        user.setFirstName(client.getPrenom());
        user.setLastName(client.getNom());
        user.setEmail(client.getEmail());

        userResource.update(user);
    }

    // Si besoin, crée le client en DB à partir des claims Keycloak
    private Client getOrCreateFromJwt(Jwt jwt, String email) {
        String keycloakId = jwt.getSubject();
        return clientRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> clientRepository.findByEmail(email)
                        .orElseGet(() -> {
                            Client c = new Client();
                            c.setEmail(email);
                            String nom = jwt.getClaimAsString("family_name");
                            c.setNom(nom != null ? nom : ""); // Handle null family_name
                            c.setPrenom(jwt.getClaimAsString("given_name"));
                            c.setKeycloakId(keycloakId);
                            c.setRole("CLIENT");
                            return clientRepository.save(c);
                        }));
    }

    private ClientResponseDTO toResponseDTO(Client client) {
        ClientResponseDTO response = new ClientResponseDTO();
        response.setId(client.getId());
        response.setNom(client.getNom());
        response.setPrenom(client.getPrenom());
        response.setEmail(client.getEmail());
        response.setNumTele(client.getNumTele());
        return response;
    }
}
