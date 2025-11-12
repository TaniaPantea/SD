package com.example.demo.services;


import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.RegisterDetailsDTO;
import com.example.demo.dtos.builders.AuthBuilder;
import com.example.demo.entities.AuthUser;
import com.example.demo.repositories.AuthRepository;
import com.example.demo.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(AuthRepository authRepository,JwtUtil jwtUtil) {
        this.authRepository = authRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthUser register(RegisterDetailsDTO dto) {
        Optional<AuthUser> existing = authRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        dto.setRole("CLIENT");
        AuthUser userEntity = AuthBuilder.toEntity(dto);

        userEntity.setPassword(encoder.encode(userEntity.getPassword()));

        userEntity = authRepository.save(userEntity);

        LOGGER.debug("User with id {} was inserted in db", userEntity.getId());

        return userEntity; // NOU: Returnează entitatea salvată
    }

    public String login(LoginDTO dto) {
        Optional<AuthUser> userOpt = authRepository.findByEmail(dto.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        AuthUser user = userOpt.get();

        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Passwords don't match");
        }
        String token = jwtUtil.generateToken(user.getEmail(),user.getRole());

        LOGGER.debug("User with id {} successfully logged in", user.getId());
        return token;
    }

    public void delete(UUID id) {
        if(authRepository.existsById(id)){
            authRepository.deleteById(id);
        }
        else {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }
    }

}
