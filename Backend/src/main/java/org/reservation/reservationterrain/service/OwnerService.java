package org.reservation.reservationterrain.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.reservation.reservationterrain.dto.OwnerProfileDTO;
import org.reservation.reservationterrain.dto.TerrainDTO;
import org.reservation.reservationterrain.dto.OwnerRegistrationDTO;
import org.reservation.reservationterrain.dto.OwnerDashboardStatsDTO;
import org.reservation.reservationterrain.dto.ReservationDTO;
import org.reservation.reservationterrain.dto.ComplexeDTO;
import org.reservation.reservationterrain.dto.PasswordChangeRequest;
import org.reservation.reservationterrain.model.Complexe;
import org.reservation.reservationterrain.model.Owner;
import org.reservation.reservationterrain.model.Reservation;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.ComplexeRepository;
import org.reservation.reservationterrain.repository.OwnerRepository;
import org.reservation.reservationterrain.repository.ReservationRepository;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
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
        private final RestTemplate restTemplate = new RestTemplate();

        @Value("${keycloak.server-url}")
        private String keycloakServerUrl;

        @Value("${keycloak.client-id:admin-cli}")
        private String clientId;

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

                Optional<Complexe> complexeOpt = complexeRepository.findFirstByOwner(owner);

                return OwnerProfileDTO.builder()
                                .id(owner.getId())
                                .nom(owner.getNom())
                                .prenom(owner.getPrenom())
                                .email(owner.getEmail())
                                .numTele(owner.getNumTele())
                                .nomComplexe(complexeOpt.map(Complexe::getNom).orElse("Aucun complexe associé"))
                                .ville(complexeOpt.map(Complexe::getVille).orElse(""))
                                .adresse(complexeOpt.map(Complexe::getAdress).orElse(""))
                                .hasComplexe(complexeOpt.isPresent())
                                .build();
        }

        public Terrain addTerrain(String ownerEmail, TerrainDTO terrainDTO) {
                Owner owner = ownerRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findFirstByOwner(owner).orElse(null);
                if (complexe == null) {
                        complexe = new Complexe();
                        complexe.setOwner(owner);
                        complexe.setNom(owner.getNomComplexe() != null ? owner.getNomComplexe() : "Mon Complexe");
                        complexe.setVille("");
                        complexe.setAdress("");
                        complexe = complexeRepository.save(complexe);
                }

                Terrain terrain = new Terrain();
                terrain.setNom(terrainDTO.getNom());
                terrain.setPrixTerrain(terrainDTO.getPrixTerrain());
                terrain.setStatus(terrainDTO.getStatus() != null ? terrainDTO.getStatus() : "OUVERT");
                terrain.setHeureOuverture(terrainDTO.getHeureOuverture());
                terrain.setHeureFermeture(terrainDTO.getHeureFermeture());
                terrain.setDureeCreneau(terrainDTO.getDureeCreneau());
                terrain.setImage(terrainDTO.getImage());
                terrain.setComplexe(complexe);

                return terrainRepository.save(terrain);
        }

        public List<TerrainDTO> getMyTerrains(String ownerEmail) {
                Owner owner = ownerRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findFirstByOwner(owner).orElse(null);
                if (complexe == null)
                        return java.util.Collections.emptyList();

                return terrainRepository.findByComplexe_Id(complexe.getId()).stream()
                                .map(t -> TerrainDTO.builder()
                                                .id(t.getId())
                                                .nom(t.getNom())
                                                .prixTerrain(t.getPrixTerrain())
                                                .status(t.getStatus())
                                                .heureOuverture(t.getHeureOuverture())
                                                .heureFermeture(t.getHeureFermeture())
                                                .dureeCreneau(t.getDureeCreneau())
                                                .image(t.getImage())
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

        public void updateOwnerComplexe(String email, ComplexeDTO complexeDTO) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findFirstByOwner(owner).orElse(null);

                if (complexe == null) {
                        complexe = new Complexe();
                        complexe.setOwner(owner);
                }

                if (complexeDTO.getNom() != null) {
                        complexe.setNom(complexeDTO.getNom());
                        owner.setNomComplexe(complexeDTO.getNom()); // Sync with Owner entity
                        ownerRepository.save(owner);
                }
                if (complexeDTO.getVille() != null)
                        complexe.setVille(complexeDTO.getVille());
                if (complexeDTO.getAdress() != null)
                        complexe.setAdress(complexeDTO.getAdress());

                complexeRepository.save(complexe);
        }

        public void changePassword(String email, PasswordChangeRequest request) {
                // 1. Verify current password
                if (!verifyCurrentPassword(email, request.getCurrentPassword())) {
                        throw new RuntimeException("Mot de passe actuel incorrect");
                }

                // 2. Validate new password
                if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                        throw new RuntimeException("Le nouveau mot de passe doit contenir au moins 6 caractères");
                }

                // 3. Get Owner to find Keycloak ID
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner non trouvé"));

                // 4. Update in Keycloak
                try {
                        System.out.println("DEBUG: Keycloak update for " + email);
                        System.out.println("DEBUG: Keycloak ID in DB: " + owner.getKeycloakId());

                        // Cross-check ID by searching by email
                        List<UserRepresentation> foundUsers = keycloak.realm(realm).users().search(email, true);
                        if (!foundUsers.isEmpty()) {
                                String actualId = foundUsers.get(0).getId();
                                System.out.println("DEBUG: Keycloak ID found by email search: " + actualId);
                                if (!actualId.equals(owner.getKeycloakId())) {
                                        System.err.println(
                                                        "DEBUG: WARNING - Mismatch detected! Updating DB with actual ID: "
                                                                        + actualId);
                                        owner.setKeycloakId(actualId);
                                        ownerRepository.save(owner);
                                }
                        }

                        UserResource userResource = keycloak.realm(realm).users().get(owner.getKeycloakId());

                        // Try to get representative to check if user exists
                        UserRepresentation userRep = userResource.toRepresentation();
                        System.out.println("DEBUG: Keycloak User found: " + userRep.getUsername() + " (Email: "
                                        + userRep.getEmail() + ")");
                        System.out.println("DEBUG: Required Actions: " + userRep.getRequiredActions());
                        CredentialRepresentation credential = new CredentialRepresentation();
                        credential.setType(CredentialRepresentation.PASSWORD);
                        credential.setValue(request.getNewPassword());
                        credential.setTemporary(false);

                        userResource.resetPassword(credential);
                        System.out.println("DEBUG: Password reset command sent successfully");
                } catch (Exception e) {
                        System.err.println("DEBUG: Keycloak Error: " + e.getMessage());
                        throw new RuntimeException("Erreur Keycloak: " + e.getMessage());
                }
        }

        private boolean verifyCurrentPassword(String email, String password) {
                String tokenUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
                body.add("grant_type", "password");
                body.add("client_id", clientId);
                body.add("username", email);
                body.add("password", password);

                HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

                try {
                        ResponseEntity<String> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, entity,
                                        String.class);
                        return response.getStatusCode() == HttpStatus.OK;
                } catch (Exception e) {
                        System.err.println("Password verification failed for " + email + ": " + e.getMessage());
                        return false;
                }
        }

        public Terrain updateTerrain(String ownerEmail, Long terrainId, TerrainDTO terrainDTO) {
                Owner owner = ownerRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findFirstByOwner(owner)
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
                if (terrainDTO.getImage() != null)
                        terrain.setImage(terrainDTO.getImage());

                // Handle Status Update if provided (e.g. for Disable/Enable)
                if (terrainDTO.getStatus() != null)
                        terrain.setStatus(terrainDTO.getStatus());

                return terrainRepository.save(terrain);
        }

        public List<ReservationDTO> getReservations(String email, Long terrainId, LocalDate date) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findFirstByOwner(owner).orElse(null);
                if (complexe == null)
                        return java.util.Collections.emptyList();

                // Use the existing Repository method for filtering by Complex
                return reservationRepository
                                .findReservationsByFilters(complexe.getId(), terrainId, null, date, date, null, null,
                                                null)
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

                Complexe complexe = complexeRepository.findFirstByOwner(owner).orElse(null);
                if (complexe == null)
                        throw new RuntimeException("Unauthorized: No complex associated with your account.");

                Reservation reservation = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new RuntimeException("Reservation not found"));

                // SECURITY CHECK: Verify the reservation belongs to a terrain of the owner's
                // complex
                if (reservation.getTerrain().getComplexe().getId() != complexe.getId()) {
                        throw new RuntimeException("Unauthorized: This reservation does not belong to your complex.");
                }

                reservation.setStatus(newStatus);
                reservationRepository.save(reservation);
        }

        public OwnerDashboardStatsDTO getDashboardStats(String email) {
                Owner owner = ownerRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));

                Complexe complexe = complexeRepository.findFirstByOwner(owner).orElse(null);
                if (complexe == null) {
                        return OwnerDashboardStatsDTO.builder()
                                        .totalReservations(0)
                                        .activeTerrains(0)
                                        .pendingReservations(0)
                                        .totalRevenue(0.0)
                                        .recentReservations(java.util.Collections.emptyList())
                                        .build();
                }

                Long complexId = complexe.getId();

                // 1. Total Reservations
                long totalReservations = reservationRepository.countByTerrain_Complexe_Id(complexId);

                // 2. Active Terrains
                long activeTerrains = terrainRepository.countByComplexe_IdAndStatus(complexId, "OUVERT");

                // 3. Pending Reservations (New confirmed reservations are considered "Pending"
                // for the owner)
                long pendingReservations = reservationRepository.countByTerrain_Complexe_IdAndStatus(complexId,
                                "CONFIRMEE");

                // 4. Total Revenue (Calculate from VALIDEE and CONFIRMEE reservations)
                List<Reservation> revenueReservations = reservationRepository
                                .findByTerrain_Complexe_IdAndStatus(complexId, "VALIDEE");
                revenueReservations.addAll(reservationRepository
                                .findByTerrain_Complexe_IdAndStatus(complexId, "CONFIRMEE"));

                double totalRevenue = revenueReservations.stream()
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

        public List<OwnerProfileDTO> getAllOwners() {
                return ownerRepository.findAll().stream()
                                .map(owner -> {
                                        Optional<Complexe> complexeOpt = complexeRepository.findFirstByOwner(owner);
                                        return OwnerProfileDTO.builder()
                                                        .id(owner.getId())
                                                        .nom(owner.getNom())
                                                        .prenom(owner.getPrenom())
                                                        .email(owner.getEmail())
                                                        .numTele(owner.getNumTele())
                                                        .nomComplexe(complexeOpt.map(Complexe::getNom)
                                                                        .orElse("Aucun complexe associé"))
                                                        .ville(complexeOpt.map(Complexe::getVille).orElse(""))
                                                        .adresse(complexeOpt.map(Complexe::getAdress).orElse(""))
                                                        .hasComplexe(complexeOpt.isPresent())
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }
}
