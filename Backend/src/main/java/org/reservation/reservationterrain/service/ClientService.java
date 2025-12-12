package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.ClientProfileUpdateRequest;
import org.reservation.reservationterrain.dto.ClientResponseDTO;
import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.repository.ClientRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
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

    // Mise à jour du profil (sans changer l'email)
    public ClientResponseDTO updateProfile(Jwt jwt, ClientProfileUpdateRequest request) {
        String email = jwt.getClaimAsString("email");
        Client client = getOrCreateFromJwt(jwt, email);

        if (request.getNom() != null) client.setNom(request.getNom());
        if (request.getPrenom() != null) client.setPrenom(request.getPrenom());
        if (request.getNumTele() != null) client.setNumTele(request.getNumTele());

        Client saved = clientRepository.save(client);
        return toResponseDTO(saved);
    }

    // Si besoin, crée le client en DB à partir des claims Keycloak
    private Client getOrCreateFromJwt(Jwt jwt, String email) {
        return clientRepository.findByEmail(email).orElseGet(() -> {
            Client c = new Client();
            c.setEmail(email);
            c.setNom(jwt.getClaimAsString("family_name"));
            c.setPrenom(jwt.getClaimAsString("given_name"));
            c.setKeycloakId(jwt.getSubject());
            c.setRole("CLIENT");
            return clientRepository.save(c);
        });
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
