package org.reservation.reservationterrain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "owners") // La table s'appellera 'owners' dans PostgreSQL
public class Owner extends User {

    // Ici tu ajoutes UNIQUEMENT ce qui est spécifique à l'Owner
    private String nomComplexe;

    // Exemple : RIB pour le paiement, Siret, etc.
    // private String iban;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Terrain> terrains;
    @Column(columnDefinition = "TEXT")
    private String photoProfil; // Lien vers l'image
}