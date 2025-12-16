package com.example.demo.listeners;

import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class UserSyncListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserSyncListener.class);
    private final UserService userService;

    @Autowired
    public UserSyncListener(UserService userService) {
        this.userService = userService;
    }

    private static final String USER_SYNC_QUEUE = "user-sync-demo-queue";

    @RabbitListener(queues = {USER_SYNC_QUEUE})
    public void handleUserSynchronization(UserSyncDTO syncDTO) {
        LOGGER.info("Received user sync event: Type={}, ID={}", syncDTO.getEventType(), syncDTO.getUserId());

        if ("USER_CREATED".equals(syncDTO.getEventType())) {

            // Construim DTO-ul de detalii folosind toate câmpurile primite din eveniment
            UserDetailsDTO userDetailsDTO = new UserDetailsDTO(
                    syncDTO.getUserId(),
                    syncDTO.getName(),
                    syncDTO.getEmail(),
                    syncDTO.getAge(),
                    syncDTO.getAddress()
            );

            // Folosim metoda de upsert care va salva toate detaliile complete
            userService.syncUser(userDetailsDTO);

            LOGGER.info("User {} synchronized successfully.", syncDTO.getUserId());
        } else if ("USER_DELETED".equals(syncDTO.getEventType())) {
            userService.deleteUser(syncDTO.getUserId());
            LOGGER.info("User {} deleted successfully from Demo-Backend.", syncDTO.getUserId());

        }
    }
}