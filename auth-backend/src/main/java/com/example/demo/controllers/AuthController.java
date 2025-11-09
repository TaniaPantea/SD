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
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/people")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDetailsDTO req) {
        authService.register(req);
        return ResponseEntity.ok("Utilizator creat cu succes!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO req) {
        authService.login(req);
        return ResponseEntity.ok("Autentificat cu succes!");
    }


}