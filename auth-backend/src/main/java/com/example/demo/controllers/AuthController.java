package com.example.demo.controllers;

import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.RegisterDetailsDTO;
import com.example.demo.entities.AuthUser;
import com.example.demo.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    // MODIFICARE AICI: Schimbă tipul răspunsului pentru a suporta UUID (Map<String, Object>)
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterDetailsDTO req) {

        // MODIFICARE AICI: Apelăm metoda și primim entitatea (cu ID-ul generat)
        AuthUser newUser = authService.register(req);

        // Cream un Map care poate conține String și UUID
        Map<String, Object> body = new HashMap<>();

        // NOU: Includem ID-ul utilizatorului generat
        body.put("userId", newUser.getId());
        body.put("message", "User successfully registered");

        return ResponseEntity.ok(body);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginDTO req) {
        String token = authService.login(req);
        Map<String, String> body = new HashMap<>();
        body.put("token", token);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("Token validated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        authService.delete(id);
        return ResponseEntity.noContent().build();
    }

}