package com.example.demo.listeners;

import com.example.demo.dtos.UserSyncDTO; // Trebuie să existe în Device-Backend
import com.example.demo.entities.SyncedUser;
import com.example.demo.repositories.SyncedUserRepository; // Repository nou
import com.example.demo.services.DeviceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
public class UserSyncListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserSyncListener.class);
    private final SyncedUserRepository userRepository;
    private final DeviceService deviceService;

    @Autowired
    public UserSyncListener(SyncedUserRepository userRepository, DeviceService deviceService) {
        this.userRepository = userRepository;
        this.deviceService = deviceService;
    }

    private static final String USER_SYNC_DEVICE_QUEUE = "user-sync-device-queue";

    @RabbitListener(queues = {USER_SYNC_DEVICE_QUEUE})
    @Transactional
    public void handleUserSynchronization(UserSyncDTO syncDTO) {
        LOGGER.info("Received user sync event: Type={}, ID={}", syncDTO.getEventType(), syncDTO.getUserId());

        if ("USER_SYNCED_FOR_DEVICE".equals(syncDTO.getEventType())) {
            if (syncDTO.getUserId() != null) {

                SyncedUser user = new SyncedUser(syncDTO.getUserId(), syncDTO.getName());

                userRepository.save(user);

                LOGGER.info("User ID {} synchronized in Device-Backend.", syncDTO.getUserId());
            }
        } else if ("USER_DELETED".equals(syncDTO.getEventType())) {

            UUID userId = syncDTO.getUserId();
            System.out.println(syncDTO.getUserId());
            deviceService.deleteDevicesByUserId(userId);
            userRepository.deleteById(userId);
            LOGGER.info("User ID {} and all associated devices successfully deleted from Device-Backend .", syncDTO.getUserId());
        }
    }
}