package org.reservation.reservationterrain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass // Les champs ici seront copiés dans la table 'owner'
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // C'EST CE CHAMP QUI MANQUAIT !
    @Column(unique = true, name = "keycloak_id")
    private String keycloakId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String nom;

    private String prenom;

    // Utile pour savoir si c'est un ADMIN ou OWNER sans demander à Keycloak
    private String role;

    @Column(unique = true)
    private String numTele;

    public User() {
    }
}