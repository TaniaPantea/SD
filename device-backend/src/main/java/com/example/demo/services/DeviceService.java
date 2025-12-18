package com.example.demo.services;


import com.example.demo.dtos.DeviceDTO;
import com.example.demo.dtos.DeviceDetailsDTO;
import com.example.demo.dtos.DeviceSyncDTO;
import com.example.demo.dtos.builders.DeviceBuilder;
import com.example.demo.entities.Device;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.synchronization}")
    private String synchronizationExchange;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository,  RabbitTemplate rabbitTemplate) {
        this.deviceRepository = deviceRepository;
        this.rabbitTemplate = rabbitTemplate;
    }


    public List<DeviceDetailsDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .collect(Collectors.toList());
    }

    public List<UUID> findAllActiveDeviceIds() {
        return deviceRepository.findByActiveTrue()
                .stream()
                .map(Device::getId)
                .collect(Collectors.toList());
    }


    public DeviceDetailsDTO findDeviceById(UUID id) {
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDetailsDTO(prosumerOptional.get());
    }

    // ...

    public UUID insert(DeviceDetailsDTO deviceDTO) {
        Device device = DeviceBuilder.toEntity(deviceDTO);
        Device savedDevice = deviceRepository.save(device);

        publishDeviceSyncEvent(savedDevice, "DEVICE_CREATED");

        LOGGER.debug("Device with id {} was inserted in db", savedDevice.getId());
        return savedDevice.getId();
    }

    public DeviceDetailsDTO update(UUID id, DeviceDetailsDTO deviceDetailsDTO) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id));

        device.setName(deviceDetailsDTO.getName());
        device.setMaxConsumption(deviceDetailsDTO.getMaxConsumption());
        device.setUserId(deviceDetailsDTO.getUserId());
        device.setActive(deviceDetailsDTO.isActive());

        Device savedDevice = deviceRepository.save(device);

        publishDeviceSyncEvent(savedDevice, "DEVICE_UPDATED");

        return DeviceBuilder.toDeviceDetailsDTO(savedDevice);
    }

    public void delete(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id));

        deviceRepository.deleteById(id);

        publishDeviceSyncEvent(device, "DEVICE_DELETED");
    }

    @Transactional
    public void deleteDevicesByUserId(UUID userId) {
        List<Device> devicesToDelete = deviceRepository.findByUserId(userId);

        deviceRepository.deleteByUserId(userId);

        for (Device device : devicesToDelete) {
            publishDeviceSyncEvent(device, "DEVICE_DELETED");
        }

        LOGGER.info("All devices for User ID {} have been deleted.", userId);
    }


    public List<DeviceDetailsDTO> findByName(String name) {
        return deviceRepository.findByName(name)
                .stream()
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .collect(Collectors.toList());
    }

    public List<DeviceDetailsDTO> findActiveDevicesByUserId(UUID userId) {
        return deviceRepository.findActiveDevicesByUserId(userId).stream()
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .collect(Collectors.toList());
    }

    private void publishDeviceSyncEvent(Device device, String eventType) {
        UUID userId = device.getUserId();

        DeviceSyncDTO syncEvent = new DeviceSyncDTO(
                device.getId(),
                device.getName(),
                userId,
                eventType
        );

        String routingKey = "DEVICE_DELETED".equals(eventType)
                ? "device.deleted"
                : "device.synced";

        rabbitTemplate.convertAndSend(synchronizationExchange, routingKey, syncEvent);
        LOGGER.info("Published {} event for Device={}", eventType, device.getId());
    }


}
