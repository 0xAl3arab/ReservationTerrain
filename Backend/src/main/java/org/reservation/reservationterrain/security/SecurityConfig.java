package org.reservation.reservationterrain.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Activation du CORS pour le
                                                                                   // Frontend React
                .authorizeHttpRequests(auth -> auth
                        // ==========================================
                        // 1. ENDPOINTS PUBLICS (Accessibles à tous)
                        // ==========================================
                        // Lecture publique uniquement : la création / modification / suppression
                        // de complexes et d'annonces exige un utilisateur connecté.
                        // Page d'erreur Spring : sinon toute exception d'un endpoint public
                        // arrive au navigateur comme un 401 vide au lieu du vrai statut.
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/complexes/**").permitAll()
                        .requestMatchers("/auth/client/signup", "/auth/client/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/annonces/**").permitAll()
                        .requestMatchers("/admin/login").permitAll()
                        // Optionnel : si tu as un endpoint de login spécifique pour owner
                        // .requestMatchers("/auth/owner/login").permitAll()
                        .requestMatchers("/api/terrains/active/**").permitAll() // Pour le compteur total-count
                        .requestMatchers("/api/terrains/{id}/reservations").permitAll() // Pour voir les dispos sur le
                                                                                        // calendrier
                        // ==========================================
                        // 2. TA PARTIE : ESPACE OWNER
                        // ==========================================
                        .requestMatchers(HttpMethod.GET, "/api/owners").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/owners/create").hasRole("ADMIN")
                        .requestMatchers("/api/owners/**").hasAnyRole("OWNER", "ADMIN")

                        // ==========================================
                        // 3. ESPACE ADMIN
                        // ==========================================
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // Gestion des complexes (la lecture GET reste publique, voir plus haut)
                        .requestMatchers(HttpMethod.POST, "/api/complexes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/complexes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/complexes/**").hasRole("ADMIN")
                        // Gestion globale des réservations. Les clients gardent
                        // POST /api/reservations, POST /api/reservations/{id}/cancel
                        // et GET /api/my-reservations (règle "authenticated" ci-dessous).
                        .requestMatchers(HttpMethod.GET, "/api/reservations/filter", "/api/reservations/count",
                                "/api/reservations/week", "/api/reservations/week/count").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/reservations/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/reservations/**").hasRole("ADMIN")

                        // ==========================================
                        // 4. AUTRES (Requiert authentification)
                        // ==========================================
                        .anyRequest().authenticated())

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    /**
     * Configuration CORS pour autoriser les requêtes venant du Frontend
     * (Vite/React)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // URL du Frontend React
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Utilise le convertisseur personnalisé pour extraire les rôles Keycloak
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return converter;
    }
}