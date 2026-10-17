package org.reservation.reservationterrain.service;

import org.reservation.reservationterrain.dto.ReservationRequest;
import org.reservation.reservationterrain.dto.ReservationResponse;
import org.reservation.reservationterrain.model.Client;
import org.reservation.reservationterrain.model.Reservation;
import org.reservation.reservationterrain.model.Terrain;
import org.reservation.reservationterrain.repository.ClientRepository;
import org.reservation.reservationterrain.repository.ReservationRepository;
import org.reservation.reservationterrain.repository.TerrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

        private final ReservationRepository reservationRepository;
        private final TerrainRepository terrainRepository;
        private final ClientRepository clientRepository;
        private final ClientService clientService;

        public ReservationService(
                        ReservationRepository reservationRepository,
                        TerrainRepository terrainRepository,
                        ClientRepository clientRepository,
                        ClientService clientService) {
                this.reservationRepository = reservationRepository;
                this.terrainRepository = terrainRepository;
                this.clientRepository = clientRepository;
                this.clientService = clientService;
        }

        @Transactional
        public ReservationResponse createReservation(ReservationRequest request, String keycloakId, String email,
                        String nom, String prenom) {
                if (request.getTerrainId() == null || request.getDate() == null
                                || request.getHeureDebut() == null || request.getHeureFin() == null) {
                        throw new IllegalArgumentException("Terrain, date, heure de début et heure de fin sont obligatoires");
                }

                // 1. Validate terrain exists
                Terrain terrain = terrainRepository.findById(request.getTerrainId())
                                .orElseThrow(
                                                () -> new IllegalArgumentException("Terrain non trouvé avec l'ID: "
                                                                + request.getTerrainId()));

                // The UI hides closed terrains, but the API must refuse them too
                if (!"OUVERT".equalsIgnoreCase(terrain.getStatus())) {
                        throw new IllegalStateException("Ce terrain n'est pas ouvert à la réservation");
                }

                // 2. Validate client exists or create if missing (Lazy Creation)
                final String finalKeycloakId;
                if (keycloakId == null) {
                        try {
                                finalKeycloakId = clientService.getKeycloakIdByEmail(email);
                                System.out.println("DEBUG: Fetched missing Keycloak ID from API: " + finalKeycloakId);
                        } catch (Exception e) {
                                throw new IllegalArgumentException(
                                                "Impossible de récupérer l'ID utilisateur: " + e.getMessage());
                        }
                } else {
                        finalKeycloakId = keycloakId;
                }

                Client client = clientRepository.findByKeycloakId(finalKeycloakId)
                                .orElseGet(() -> {
                                        // Try to find by email first (migration case)
                                        return clientRepository.findByEmail(email)
                                                        .map(existingClient -> {
                                                                existingClient.setKeycloakId(finalKeycloakId);
                                                                return clientRepository.save(existingClient);
                                                        })
                                                        .orElseGet(() -> {
                                                                // Create new client
                                                                Client newClient = new Client();
                                                                newClient.setKeycloakId(finalKeycloakId);
                                                                // Handle potential null email from JWT
                                                                newClient.setEmail(email != null ? email
                                                                                : "no-email-" + finalKeycloakId
                                                                                                + "@placeholder.com");

                                                                newClient.setNom(nom != null && !nom.isEmpty() ? nom
                                                                                : "Inconnu");
                                                                newClient.setPrenom(prenom != null ? prenom : "");
                                                                newClient.setRole("CLIENT");
                                                                return clientRepository.save(newClient);
                                                        });
                                });

                // 3. Validate time range
                if (request.getHeureDebut().isAfter(request.getHeureFin()) ||
                                request.getHeureDebut().equals(request.getHeureFin())) {
                        throw new IllegalArgumentException("L'heure de début doit être avant l'heure de fin");
                }

                if (LocalDateTime.of(request.getDate(), request.getHeureDebut()).isBefore(LocalDateTime.now())) {
                        throw new IllegalArgumentException("Impossible de réserver un créneau dans le passé");
                }

                // 4. Validate time is within terrain opening hours
                validateOpeningHours(terrain, request.getHeureDebut(), request.getHeureFin());

                // 5. Check for overlapping reservations
                List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                                request.getTerrainId(),
                                request.getDate(),
                                request.getHeureDebut(),
                                request.getHeureFin());

                if (!overlapping.isEmpty()) {
                        throw new IllegalStateException(
                                        "Ce créneau horaire est déjà réservé. Veuillez choisir un autre horaire.");
                }

                // 6. Calculate duration in minutes
                Duration duration = Duration.between(request.getHeureDebut(), request.getHeureFin());
                int durationMinutes = (int) duration.toMinutes();

                // 7. Create and save reservation
                Reservation reservation = new Reservation();
                reservation.setTerrain(terrain);
                reservation.setClient(client);
                reservation.setDate(request.getDate());
                reservation.setHeureDebut(request.getHeureDebut());
                reservation.setHeureFin(request.getHeureFin());
                reservation.setDuree(durationMinutes);
                reservation.setStatus("CONFIRMEE");

                Reservation saved = reservationRepository.save(reservation);

                // 8. Convert to response DTO
                return toResponse(saved);
        }

        // Public endpoint used to display availability: skip cancelled reservations
        // (they no longer block the slot) and do not expose client details.
        public List<ReservationResponse> getReservationsByTerrain(Long terrainId, LocalDate date) {
                List<Reservation> reservations = reservationRepository.findByTerrainIdAndDate(terrainId, date);
                return reservations.stream()
                                .filter(r -> !"ANNULEE".equals(r.getStatus()))
                                .map(this::toResponse)
                                .peek(r -> {
                                        r.setClientId(null);
                                        r.setClientNom(null);
                                        r.setClientEmail(null);
                                })
                                .collect(Collectors.toList());
        }

        public List<ReservationResponse> getReservationsByDateRange(LocalDate start, LocalDate end) {
                return reservationRepository.findByDateBetween(start, end).stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        public long countTotalReservations() {
                return reservationRepository.count();
        }

        public long countWeeklyReservations(LocalDate start, LocalDate end) {
                return reservationRepository.countByDateBetween(start, end);
        }

        public List<ReservationResponse> getReservationsWithFilters(
                        Long complexId, Long clientId, String clientQuery, LocalDate dateFrom, LocalDate dateTo,
                        String status,
                        Integer minDuration, Integer maxDuration) {
                String query = clientQuery == null ? "" : clientQuery.trim().toLowerCase();
                return reservationRepository.findReservationsByFilters(
                                complexId, null, clientId, dateFrom, dateTo,
                                status,
                                minDuration, maxDuration).stream()
                                .map(this::toResponse)
                                // free-text search on the client's name or email (admin search box)
                                .filter(r -> query.isEmpty()
                                                || (r.getClientNom() + " " + r.getClientEmail()).toLowerCase()
                                                                .contains(query))
                                .collect(Collectors.toList());
        }

        @Transactional
        public ReservationResponse updateReservation(Long id, ReservationRequest request) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

                // 1. Validate terrain exists (if changed)
                if (reservation.getTerrain().getId() != request.getTerrainId()) {
                        Terrain terrain = terrainRepository.findById(request.getTerrainId())
                                        .orElseThrow(() -> new IllegalArgumentException("Terrain non trouvé"));
                        reservation.setTerrain(terrain);
                }

                // 2. Validate time range
                if (request.getHeureDebut().isAfter(request.getHeureFin()) ||
                                request.getHeureDebut().equals(request.getHeureFin())) {
                        throw new IllegalArgumentException("L'heure de début doit être avant l'heure de fin");
                }

                // 3. Validate time is within terrain opening hours
                Terrain terrain = reservation.getTerrain();
                validateOpeningHours(terrain, request.getHeureDebut(), request.getHeureFin());

                // 4. Check for overlapping reservations (excluding current one)
                List<Reservation> overlapping = reservationRepository.findOverlappingReservationsExcludingId(
                                terrain.getId(),
                                request.getDate(),
                                request.getHeureDebut(),
                                request.getHeureFin(),
                                id);

                if (!overlapping.isEmpty()) {
                        throw new IllegalStateException(
                                        "Ce créneau horaire est déjà réservé. Veuillez choisir un autre horaire.");
                }

                // 5. Update fields
                reservation.setDate(request.getDate());
                reservation.setHeureDebut(request.getHeureDebut());
                reservation.setHeureFin(request.getHeureFin());

                Duration duration = Duration.between(request.getHeureDebut(), request.getHeureFin());
                reservation.setDuree((int) duration.toMinutes());

                if (request.getStatus() != null) {
                        reservation.setStatus(request.getStatus());
                }

                Reservation saved = reservationRepository.save(reservation);
                return toResponse(saved);
        }

        @Transactional
        public void deleteReservation(Long id) {
                if (!reservationRepository.existsById(id)) {
                        throw new IllegalArgumentException("Réservation non trouvée");
                }
                reservationRepository.deleteById(id);
        }

        @Transactional
        public void deleteReservations(List<Long> ids) {
                reservationRepository.deleteAllById(ids);
        }

        // Compare in seconds so that e.g. 22:30 is rejected when the terrain closes at 22
        private void validateOpeningHours(Terrain terrain, LocalTime debut, LocalTime fin) {
                if (debut.toSecondOfDay() < terrain.getHeureOuverture() * 3600) {
                        throw new IllegalArgumentException(
                                        String.format("L'heure de début (%s) est avant l'heure d'ouverture du terrain (%02d:00)",
                                                        debut, terrain.getHeureOuverture()));
                }

                if (fin.toSecondOfDay() > terrain.getHeureFermeture() * 3600) {
                        throw new IllegalArgumentException(
                                        String.format("L'heure de fin (%s) est après l'heure de fermeture du terrain (%02d:00)",
                                                        fin, terrain.getHeureFermeture()));
                }
        }

        private ReservationResponse toResponse(Reservation reservation) {
                ReservationResponse response = new ReservationResponse();
                response.setId(reservation.getId());
                response.setStatus(reservation.getStatus());
                response.setDate(reservation.getDate());
                response.setHeureDebut(reservation.getHeureDebut());
                response.setHeureFin(reservation.getHeureFin());
                response.setDuree(reservation.getDuree());

                response.setTerrainId(reservation.getTerrain().getId());
                response.setTerrainNom(reservation.getTerrain().getNom());
                response.setComplexNom(reservation.getTerrain().getComplexe().getNom());
                response.setPrice(reservation.getTerrain().getPrixTerrain());

                response.setClientId(reservation.getClient().getId());
                response.setClientNom(reservation.getClient().getNom() + " " +
                                (reservation.getClient().getPrenom() != null ? reservation.getClient().getPrenom()
                                                : ""));
                response.setClientEmail(reservation.getClient().getEmail());

                return response;
        }

        public List<ReservationResponse> getReservationsByKeycloakId(String keycloakId) {
                Client client = clientRepository.findByKeycloakId(keycloakId)
                                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé"));

                return reservationRepository.findByClientId(client.getId()).stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public void cancelReservation(Long reservationId, String keycloakId) {
                Reservation reservation = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

                // Verify ownership
                Client client = clientRepository.findByKeycloakId(keycloakId)
                                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé"));

                if (!reservation.getClient().getId().equals(client.getId())) {
                        throw new SecurityException("Vous n'êtes pas autorisé à annuler cette réservation");
                }

                // Check if already cancelled
                if ("ANNULEE".equals(reservation.getStatus())) {
                        throw new IllegalStateException("La réservation est déjà annulée");
                }

                // Check 3h rule
                // Reservation Date + Start Time
                LocalDate resDate = reservation.getDate();
                LocalTime resTime = reservation.getHeureDebut();
                java.time.LocalDateTime reservationStart = java.time.LocalDateTime.of(resDate, resTime);
                java.time.LocalDateTime now = java.time.LocalDateTime.now();

                long hoursUntilStart = java.time.Duration.between(now, reservationStart).toHours();

                if (hoursUntilStart < 3) {
                        throw new IllegalStateException(
                                        "L'annulation n'est possible que jusqu'à 3 heures avant le début de la réservation.");
                }

                reservation.setStatus("ANNULEE");
                reservationRepository.save(reservation);
        }
}
