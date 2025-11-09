package com.example.demo.services;


import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.RegisterDetailsDTO;
import com.example.demo.dtos.builders.AuthBuilder;
import com.example.demo.entities.AuthUser;
import com.example.demo.repositories.AuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public void register(RegisterDetailsDTO dto) {
        Optional<AuthUser> existing = authRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        AuthUser userEntity = AuthBuilder.toEntity(dto);

        userEntity.setPassword(encoder.encode(userEntity.getPassword()));

        authRepository.save(userEntity);
        LOGGER.debug("User with id {} was inserted in db", userEntity.getId());
    }

    public void login(LoginDTO dto) {
        Optional<AuthUser> userOpt = authRepository.findByEmail(dto.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        AuthUser user = userOpt.get();

        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Passwords don't match");
        }

        LOGGER.debug("User with id {} successfully logged in", user.getId());
    }

}
