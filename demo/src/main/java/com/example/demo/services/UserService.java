package com.example.demo.services;


import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.dtos.builders.UserBuilder;
import com.example.demo.entities.User;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.synchronization}")
    private String synchronizationExchange;

    @Autowired
    public UserService(UserRepository userRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }
    public List<UserDetailsDTO> findPersons() {
        List<User> personList = userRepository.findAll();
        return personList.stream()
                .map(UserBuilder::toPersonDetailsDTO)
                .collect(Collectors.toList());
    }

    public UserDetailsDTO findPersonById(UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(UserDetailsDTO personDTO) {
        User user = UserBuilder.toEntity(personDTO);
        user = userRepository.save(user);
        LOGGER.debug("User with id {} was inserted in db", user.getId());
        return user.getId();
    }
    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        userRepository.deleteById(id);
    }
    public UserDetailsDTO update(UUID id, UserDetailsDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        User user = optionalUser.get();
        user.setUsername(userDTO.getUsername());
        user.setAddress(userDTO.getAddress());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());

        userRepository.save(user);
        return UserBuilder.toPersonDetailsDTO(user);
    }

    @Transactional
    public UUID syncUser(UserDetailsDTO userDTO) {

        Optional<User> existingUserOpt = userRepository.findById(userDTO.getId());
        User user;

        if (existingUserOpt.isPresent()) {
            User existing = existingUserOpt.get();

            existing.setEmail(userDTO.getEmail());
            existing.setUsername(userDTO.getUsername());

            if (userDTO.getAddress() != null) {
                existing.setAddress(userDTO.getAddress());
            }
            if (userDTO.getAge() != null) {
                existing.setAge(userDTO.getAge());
            }

            user = userRepository.save(existing);
            LOGGER.debug("User updated (sync): ID={}", user.getId());

        } else {
            User newUser = UserBuilder.toEntity(userDTO);
            user = userRepository.save(newUser);
            LOGGER.debug("User inserted (sync): ID={}", user.getId());
        }

        publishUserSyncedEvent(user);

        return user.getId();
    }

    private void publishUserSyncedEvent(User user) {
        // Device-Backend are nevoie doar de ID-ul utilizatorului.
        UserSyncDTO syncEvent = new UserSyncDTO();
        syncEvent.setUserId(user.getId());
        syncEvent.setName(user.getUsername());
        syncEvent.setEventType("USER_SYNCED_FOR_DEVICE");


        rabbitTemplate.convertAndSend(synchronizationExchange, "user.synced", syncEvent);
        LOGGER.info("Published USER_SYNCED event for Device-Backend for ID: {}", user.getId());
    }


    @Transactional
    public void deleteUser(UUID userId) {
        if(userRepository.existsById(userId)) {
            userRepository.deleteById(userId);

            publishUserDeletedEventToDevice(userId);
        } else {
            LOGGER.warn("Attempted to delete non-existent user ID {} in Demo-Backend.", userId);
        }
    }

    private void publishUserDeletedEventToDevice(UUID userId) {
        UserSyncDTO syncEvent = new UserSyncDTO();
        syncEvent.setUserId(userId);
        syncEvent.setEventType("USER_DELETED");

        rabbitTemplate.convertAndSend(synchronizationExchange, "user.deleted", syncEvent);
        LOGGER.info("Published USER_DELETED event to Device-Backend for ID: {}", userId);
    }
}

