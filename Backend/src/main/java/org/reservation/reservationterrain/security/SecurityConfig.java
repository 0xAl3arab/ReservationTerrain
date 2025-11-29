package org.reservation.reservationterrain.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // On désactive CSRF car on utilise des Tokens
                .cors(org.springframework.security.config.Customizer.withDefaults()) // Active le CORS qu'on a configuré
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/public/**").permitAll() // Pages publiques
                        .anyRequest().authenticated() // Tout le reste nécessite d'être connecté
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(
                        org.springframework.security.config.Customizer.withDefaults())); // C'est ça qui vérifie le
                                                                                         // Token Keycloak !

        return http.build();
    }
}