package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    /**
     * Cette méthode est appelée quand l'Owner se connecte.
     * Si c'est la première fois, on le crée dans la base de données.
     */
    public Owner getCurrentOwner(Jwt jwt) {
        // 1. On récupère l'ID unique de Keycloak (le "sub")
        String keycloakId = jwt.getSubject();
        
        // 2. On récupère les infos du Token (Email, Nom, Prénom)
        String email = jwt.getClaimAsString("email");
        String nom = jwt.getClaimAsString("family_name");
        String prenom = jwt.getClaimAsString("given_name");

        // 3. On cherche si cet Owner existe déjà dans NOTRE base de données
        return ownerRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> {
                    // 4. S'il n'existe pas, on le CRÉE (Inscription automatique)
                    Owner newOwner = new Owner();
                    
                    // Partie commune (User)
                    newOwner.setKeycloakId(keycloakId);
                    newOwner.setEmail(email);
                    newOwner.setNom(nom != null ? nom : "Propriétaire");
                    newOwner.setPrenom(prenom != null ? prenom : "");
                    newOwner.setRole("OWNER"); // On force le rôle
                    
                    // Partie spécifique (Owner)
                    // newOwner.setNomComplexe("À définir"); 
                    
                    return ownerRepository.save(newOwner);
                });
    }

    /**
     * Cette méthode permet à l'Owner de modifier son profil.
     */
    public Owner updateOwner(Jwt jwt, Owner infosAjour) {
        // On récupère d'abord l'utilisateur actuel
        Owner currentOwner = getCurrentOwner(jwt);

        // On met à jour seulement les champs qu'il a le droit de modifier
        if (infosAjour.getNumTele() != null) {
            currentOwner.setNumTele(infosAjour.getNumTele());
        }
        
        if (infosAjour.getNomComplexe() != null) {
            currentOwner.setNomComplexe(infosAjour.getNomComplexe());
        }

        if (infosAjour.getNom() != null) {
            currentOwner.setNom(infosAjour.getNom());
        }

        if (infosAjour.getPrenom() != null) {
            currentOwner.setPrenom(infosAjour.getPrenom());
        }

        return ownerRepository.save(currentOwner);
    }
}