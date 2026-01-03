package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws-notifications/**").permitAll()
                        .anyRequest().authenticated()
                )
                // ADAUGĂ ACEASTĂ LINIE:
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    //am nevoie de cls asta pt ca
    //1. Traefik verifică doar "ușa", nu și "conversația"
    //Handshake-ul (Citesc Path-ul): Traefik aplică auth-jwt doar în momentul primei cereri HTTP (Handshake),
    // când browserul cere „trecerea” la protocolul WebSocket. Dacă token-ul este valid, Traefik deschide conexiunea.
    //Conexiunea Persistentă: Odată ce conexiunea WebSocket este stabilită, ea devine un „tunel” deschis direct între
    // browser și microserviciul tău. Traefik nu mai analizează fiecare mesaj individual
    // (fiecare punct din broken line sau fiecare replică de chat) care trece prin acel tunel.
}