package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.ClientSignupRequest;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.repository.ClientRepository;
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
}
