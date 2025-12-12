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

    // tu peux encore l’utiliser si tu veux un signup sans Keycloak
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

    public ClientResponseDTO updateProfile(Jwt jwt, ClientProfileUpdateRequest request) {
        String email = jwt.getClaimAsString("email");
        Client client = getByEmail(email);

        if (request.getNom() != null) client.setNom(request.getNom());
        if (request.getPrenom() != null) client.setPrenom(request.getPrenom());
        if (request.getNumTele() != null) client.setNumTele(request.getNumTele());

        Client saved = clientRepository.save(client);

        ClientResponseDTO response = new ClientResponseDTO();
        response.setId(saved.getId());
        response.setNom(saved.getNom());
        response.setPrenom(saved.getPrenom());
        response.setEmail(saved.getEmail());
        response.setNumTele(saved.getNumTele());

        return response;
    }
}
