package com.example.demo.listeners;

import com.example.demo.dtos.DeviceSyncDTO;
import com.example.demo.entities.DeviceUserMap;
import com.example.demo.repositories.DeviceUserMapRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeviceSyncListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceSyncListener.class);
    private final DeviceUserMapRepository repository;

    public DeviceSyncListener(DeviceUserMapRepository repository) {
        this.repository = repository;
    }

    private static final String DEVICE_SYNC_MONITORING_QUEUE = "device-sync-monitoring-queue";

    @RabbitListener(queues = {DEVICE_SYNC_MONITORING_QUEUE})
    public void handleDeviceSynchronization(DeviceSyncDTO syncDTO) {

        if (syncDTO.getDeviceId() == null) return;

        if ("DEVICE_DELETED".equals(syncDTO.getEventType())) {
            repository.deleteById(syncDTO.getDeviceId());
            LOGGER.info("Device ID {} mapping deleted.", syncDTO.getDeviceId());
        } else {
            DeviceUserMap mapping = new DeviceUserMap();
            mapping.setDeviceId(syncDTO.getDeviceId());
            mapping.setUserId(syncDTO.getUserId());
            mapping.setDeviceName(syncDTO.getDeviceName());
            mapping.setMaxConsumption(syncDTO.getMaxConsumption());
            repository.save(mapping);
            LOGGER.info("Device ID {} mapped to User ID {}.", syncDTO.getDeviceId(), syncDTO.getUserId());
        }
    }
}