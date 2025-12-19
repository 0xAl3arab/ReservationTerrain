package org.reservation.reservationterrain.repository;
import org.reservation.reservationterrain.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRespository extends JpaRepository<Client,Long> {
}


/*
On utilise une interface pour les repository Spring Data JPA (et pas une classe) parce que Spring va générer automatiquement la classe d’implémentation à partir de cette interface au démarrage de l’application.
1. Rôle d’une interface
Une interface décrit ce qu’on veut faire (le contrat) : les méthodes disponibles comme findAll(), save(), findById(), ou tes méthodes perso findByEmail(...).
Elle ne contient pas de code métier ni de logique SQL: juste les signatures de méthodes, que Spring va implémenter.
public interface OwnerRepository extends JpaRepository<Owner, Long> { }
Spring crée à l’exécution une classe proxy qui implémente cette interface et fournit tout le code pour accéder à la base (via EntityManager, requêtes, etc.).
Tu n’as donc pas besoin d’écrire toi‑même class OwnerRepositoryImpl implements OwnerRepository avec tout le code JPA à l’intérieur: c’est généré automatiquement.
3. Pourquoi pas une classe normale ?
Si tu faisais une classe normale, tu serais obligé:
d’implémenter toi‑même toutes les méthodes CRUD (save, findAll, etc.),
de gérer EntityManager, les requêtes, les transactions, etc.
En gardant un repository en interface, tu dis juste à Spring: “voilà les opérations dont j’ai besoin”, et Spring te fournit l’implémentation complète.
 */