package org.reservation.reservationterrain.service;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.reservation.reservationterrain.dto.OwnerProfileDTO;
import org.reservation.reservationterrain.dto.TerrainDTO;
import org.reservation.reservationterrain.dto.OwnerRegistrationDTO;
import org.reservation.reservationterrain.dto.OwnerDashboardStatsDTO;
import org.reservation.reservationterrain.dto.ReservationDTO;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.model.Reservation;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.ComplexeRepository;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.reservation.reservationterrain.repository.ReservationRepository;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OwnerService {

        private final Keycloak keycloak;
        private final String realm;
        private final OwnerRepository ownerRepository;
        private final ComplexeRepository complexeRepository;
        private final TerrainRepository terrainRepository;
        private final ReservationRepository reservationRepository;

        public OwnerService(Keycloak keycloak,
                        @Value("${keycloak.realm}") String keycloakRealmName,
                        OwnerRepository ownerRepository,
                        ComplexeRepository complexeRepository,
                        TerrainRepository terrainRepository,
                        ReservationRepository reservationRepository) {
                this.keycloak = keycloak;
                this.realm = keycloakRealmName;
                this.ownerRepository = ownerRepository;
                this.complexeRepository = complexeRepository;
                this.terrainRepository = terrainRepository;
                this.reservationRepository = reservationRepository;
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
                                        "Erreur création user Keycloak: " + response.getStatus() + " "
                                                        + response.getStatusInfo());
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

        public OwnerProfileDTO getOwnerProfile(String email) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found with email: " + email));

                Optional<Complexe> complexeOpt = complexeRepository.findByOwner(owner);

                return OwnerProfileDTO.builder()
                                .nom(owner.getNom())
                                .prenom(owner.getPrenom())
                                .email(owner.getEmail())
                                .numTele(owner.getNumTele())
                                .nomComplexe(complexeOpt.map(Complexe::getNom).orElse("Aucun complexe associé"))
                                .ville(complexeOpt.map(Complexe::getVille).orElse(""))
                                .adresse(complexeOpt.map(Complexe::getAdress).orElse(""))
                                .build();
        }

        public Terrain addTerrain(String ownerEmail, TerrainDTO terrainDTO) {
                Owner owner = ownerRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findByOwner(owner)
                                .orElseThrow(() -> new RuntimeException("Complexe not found for owner: " + ownerEmail));

                Terrain terrain = new Terrain();
                terrain.setNom(terrainDTO.getNom());
                terrain.setPrixTerrain(terrainDTO.getPrixTerrain());
                terrain.setStatus(terrainDTO.getStatus() != null ? terrainDTO.getStatus() : "OUVERT");
                terrain.setHeureOuverture(terrainDTO.getHeureOuverture());
                terrain.setHeureFermeture(terrainDTO.getHeureFermeture());
                terrain.setDureeCreneau(terrainDTO.getDureeCreneau());
                terrain.setComplexe(complexe);

                return terrainRepository.save(terrain);
        }

        public List<TerrainDTO> getMyTerrains(String ownerEmail) {
                Owner owner = ownerRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findByOwner(owner)
                                .orElseThrow(() -> new RuntimeException("Complexe not found for owner: " + ownerEmail));

                return terrainRepository.findByComplexe_Id(complexe.getId()).stream()
                                .map(t -> TerrainDTO.builder()
                                                .id(t.getId())
                                                .nom(t.getNom())
                                                .prixTerrain(t.getPrixTerrain())
                                                .status(t.getStatus())
                                                .heureOuverture(t.getHeureOuverture())
                                                .heureFermeture(t.getHeureFermeture())
                                                .dureeCreneau(t.getDureeCreneau())
                                                .build())
                                .collect(Collectors.toList());
        }

        public void updateOwnerProfile(String email, OwnerProfileDTO profileDTO) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                if (profileDTO.getNom() != null)
                        owner.setNom(profileDTO.getNom());
                if (profileDTO.getPrenom() != null)
                        owner.setPrenom(profileDTO.getPrenom());
                if (profileDTO.getNumTele() != null)
                        owner.setNumTele(profileDTO.getNumTele());

                ownerRepository.save(owner);
        }

        public Terrain updateTerrain(String ownerEmail, Long terrainId, TerrainDTO terrainDTO) {
                Owner owner = ownerRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findByOwner(owner)
                                .orElseThrow(() -> new RuntimeException("Complexe not found for owner: " + ownerEmail));

                Terrain terrain = terrainRepository.findById(terrainId)
                                .orElseThrow(() -> new RuntimeException("Terrain not found"));

                // SECURITY CHECK: Verify that the terrain belongs to the owner's complex
                if (terrain.getComplexe().getId() != complexe.getId()) {
                        throw new RuntimeException("Unauthorized: This terrain does not belong to your complex.");
                }

                // Update fields
                if (terrainDTO.getNom() != null)
                        terrain.setNom(terrainDTO.getNom());
                if (terrainDTO.getPrixTerrain() != null)
                        terrain.setPrixTerrain(terrainDTO.getPrixTerrain());
                if (terrainDTO.getHeureOuverture() != null)
                        terrain.setHeureOuverture(terrainDTO.getHeureOuverture());
                if (terrainDTO.getHeureFermeture() != null)
                        terrain.setHeureFermeture(terrainDTO.getHeureFermeture());
                if (terrainDTO.getDureeCreneau() != null)
                        terrain.setDureeCreneau(terrainDTO.getDureeCreneau());

                // Handle Status Update if provided (e.g. for Disable/Enable)
                if (terrainDTO.getStatus() != null)
                        terrain.setStatus(terrainDTO.getStatus());

                return terrainRepository.save(terrain);
        }

        public List<ReservationDTO> getReservations(String email) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findByOwner(owner)
                                .orElseThrow(() -> new RuntimeException("Complexe not found for owner"));

                // Use the existing Repository method for filtering by Complex
                return reservationRepository
                                .findReservationsByFilters(complexe.getId(), null, null, null, null, null, null)
                                .stream()
                                .map(res -> ReservationDTO.builder()
                                                .id(res.getId())
                                                .status(res.getStatus())
                                                .date(res.getDate())
                                                .heureDebut(res.getHeureDebut())
                                                .heureFin(res.getHeureFin())
                                                .duree(res.getDuree())
                                                .clientNom(res.getClient().getNom())
                                                .clientPrenom(res.getClient().getPrenom())
                                                .clientNumTele(res.getClient().getNumTele())
                                                .terrainNom(res.getTerrain().getNom())
                                                .prixTerrain(res.getTerrain().getPrixTerrain())
                                                .build())
                                .collect(Collectors.toList());
        }

        public void validateReservation(String email, Long reservationId) {
                updateReservationStatus(email, reservationId, "VALIDEE");
        }

        public void cancelReservation(String email, Long reservationId) {
                updateReservationStatus(email, reservationId, "ANNULEE");
        }

        private void updateReservationStatus(String email, Long reservationId, String newStatus) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findByOwner(owner)
                                .orElseThrow(() -> new RuntimeException("Complexe not found for owner"));

                Reservation reservation = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new RuntimeException("Reservation not found"));

                // SECURITY CHECK: Verify the reservation belongs to a terrain of the owner's
                // complex
                if (reservation.getTerrain().getComplexe().getId() != complexe.getId()) {
                        throw new RuntimeException("Unauthorized: This reservation does not belong to your complex.");
                }

                reservation.setStatus(newStatus);
                reservationRepository.save(reservation);
                reservationRepository.save(reservation);
        }

        public OwnerDashboardStatsDTO getDashboardStats(String email) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findByOwner(owner)
                                .orElseThrow(() -> new RuntimeException("Complexe not found for owner"));

                Long complexId = complexe.getId();

                // 1. Total Reservations
                long totalReservations = reservationRepository.countByTerrain_Complexe_Id(complexId);

                // 2. Active Terrains
                long activeTerrains = terrainRepository.countByComplexe_IdAndStatus(complexId, "OUVERT");

                // 3. Pending Reservations
                long pendingReservations = reservationRepository.countByTerrain_Complexe_IdAndStatus(complexId,
                                "EN_ATTENTE");

                // 4. Total Revenue (Calculate from VALIDEE reservations)
                List<Reservation> validatedReservations = reservationRepository
                                .findByTerrain_Complexe_IdAndStatus(complexId, "VALIDEE");
                double totalRevenue = validatedReservations.stream()
                                .mapToDouble(res -> {
                                        try {
                                                return Double.parseDouble(res.getTerrain().getPrixTerrain());
                                        } catch (NumberFormatException e) {
                                                return 0.0;
                                        }
                                })
                                .sum();

                // 5. Recent Reservations
                List<ReservationDTO> recentReservations = reservationRepository
                                .findTop3ByTerrain_Complexe_IdOrderByDateDescHeureDebutDesc(complexId)
                                .stream()
                                .map(res -> ReservationDTO.builder()
                                                .id(res.getId())
                                                .status(res.getStatus())
                                                .date(res.getDate())
                                                .heureDebut(res.getHeureDebut())
                                                .heureFin(res.getHeureFin())
                                                .duree(res.getDuree())
                                                .clientNom(res.getClient().getNom())
                                                .clientPrenom(res.getClient().getPrenom())
                                                .clientNumTele(res.getClient().getNumTele())
                                                .terrainNom(res.getTerrain().getNom())
                                                .prixTerrain(res.getTerrain().getPrixTerrain())
                                                .build())
                                .collect(Collectors.toList());

                return OwnerDashboardStatsDTO.builder()
                                .totalReservations(totalReservations)
                                .activeTerrains(activeTerrains)
                                .pendingReservations(pendingReservations)
                                .totalRevenue(totalRevenue)
                                .recentReservations(recentReservations)
                                .build();
        }
}
