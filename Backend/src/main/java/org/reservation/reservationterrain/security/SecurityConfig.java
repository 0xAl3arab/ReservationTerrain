package org.reservation.reservationterrain.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                        .requestMatchers("/api/complexes/**").permitAll()
                        .requestMatchers("/auth/client/**").permitAll()
                        .requestMatchers("/annonces/**").permitAll() // Allow public access to announcements
                        .requestMatchers("/admin/login").permitAll()
                        // Optionnel : si tu as un endpoint de login spécifique pour owner
                        // .requestMatchers("/auth/owner/login").permitAll()
                        .requestMatchers("/api/terrains/active/**").permitAll() // Pour le compteur total-count
                        .requestMatchers("/api/terrains/{id}/reservations").permitAll() // Pour voir les dispos sur le
                                                                                        // calendrier
                        // ==========================================
                        // 2. TA PARTIE : ESPACE OWNER
                        // ==========================================
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/owners").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/owners/create").authenticated()
                        .requestMatchers("/api/owners/**").hasAnyRole("OWNER", "ADMIN")

                        // ==========================================
                        // 3. ESPACE ADMIN
                        // ==========================================
                        .requestMatchers("/admin/**").hasRole("ADMIN")

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