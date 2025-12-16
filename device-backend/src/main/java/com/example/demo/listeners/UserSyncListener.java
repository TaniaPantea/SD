package com.example.demo.listeners;

import com.example.demo.dtos.UserSyncDTO; // Trebuie să existe în Device-Backend
import com.example.demo.entities.SyncedUser;
import com.example.demo.repositories.SyncedUserRepository; // Repository nou
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserSyncListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserSyncListener.class);
    private final SyncedUserRepository userRepository;

    @Autowired
    public UserSyncListener(SyncedUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private static final String USER_SYNC_DEVICE_QUEUE = "user-sync-device-queue";

    @RabbitListener(queues = {USER_SYNC_DEVICE_QUEUE})
    public void handleUserSynchronization(UserSyncDTO syncDTO) {
        LOGGER.info("Received user sync event: Type={}, ID={}", syncDTO.getEventType(), syncDTO.getUserId());

        if ("USER_SYNCED_FOR_DEVICE".equals(syncDTO.getEventType())) {
            if (syncDTO.getUserId() != null) {

                SyncedUser user = new SyncedUser(syncDTO.getUserId(), syncDTO.getName());
                userRepository.save(user);

                LOGGER.info("User ID {} synchronized in Device-Backend.", syncDTO.getUserId());
            }
        } else if ("USER_DELETED".equals(syncDTO.getEventType())) {
            userRepository.deleteById(syncDTO.getUserId());
            LOGGER.info("User ID {} successfully deleted from Device-Backend.", syncDTO.getUserId());
        }
    }
}