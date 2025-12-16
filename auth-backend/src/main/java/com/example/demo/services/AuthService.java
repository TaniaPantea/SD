package com.example.demo.services;


import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.RegisterDetailsDTO;
import com.example.demo.dtos.builders.AuthBuilder;
import com.example.demo.dtos.builders.UserSyncBuilder;
import com.example.demo.entities.AuthUser;
import com.example.demo.entities.UserDetails;
import com.example.demo.repositories.AuthRepository;
import com.example.demo.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.dtos.UserSyncDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.synchronization}")
    private String synchronizationExchange;

    @Autowired
    public AuthService(AuthRepository authRepository, JwtUtil jwtUtil, RabbitTemplate rabbitTemplate) {
        this.authRepository = authRepository;
        this.jwtUtil = jwtUtil;
        this.rabbitTemplate = rabbitTemplate;
    }

    //daca nu pun tranzactional da eroare pt ca userdetails e lazy
    @Transactional
    public AuthUser register(RegisterDetailsDTO dto) {
        Optional<AuthUser> existing = authRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        dto.setRole("CLIENT");
        AuthUser userEntity = AuthBuilder.toEntity(dto);
        userEntity.setPassword(encoder.encode(userEntity.getPassword()));
        userEntity = authRepository.save(userEntity);

        publishUserCreatedEvent(userEntity);

        LOGGER.debug("User with id {} was inserted in db", userEntity.getId());
        return userEntity;
    }

    private void publishUserCreatedEvent(AuthUser user) {

        UserSyncDTO syncEvent = UserSyncBuilder.toUserSyncDTO(user, user.getUserDetails(), "USER_CREATED");

        rabbitTemplate.convertAndSend(synchronizationExchange, "user.created", syncEvent);
        LOGGER.info("Published USER_CREATED event for ID: {}", user.getId());
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
        String token = jwtUtil.generateToken(user.getId(),user.getEmail(),user.getRole());

        LOGGER.debug("User with id {} successfully logged in", user.getId());
        return token;
    }


    private void publishUserDeletedEvent(AuthUser user) {
        UserSyncDTO syncEvent = UserSyncBuilder.toUserSyncDTO(user, null, "USER_DELETED");

        rabbitTemplate.convertAndSend(synchronizationExchange, "user.deleted", syncEvent);
        LOGGER.info("Published USER_DELETED event for ID: {}", user.getId());
    }

    public void delete(UUID id) {
        Optional<AuthUser> userOpt = authRepository.findById(id);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }

        AuthUser userToDelete = userOpt.get();

        authRepository.deleteById(id);
        LOGGER.info("User with id {} deleted from Auth-Backend.", id);

        publishUserDeletedEvent(userToDelete);
    }

}

