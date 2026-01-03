package com.example.demo.services;

import com.example.demo.dtos.AlertDTO;
import com.example.demo.dtos.HourlyConsumptionDTO;
import com.example.demo.dtos.MeasurementDTO;
import com.example.demo.dtos.builders.HourlyConsumptionBuilder;
import com.example.demo.entities.DeviceUserMap;
import com.example.demo.entities.HourlyConsumption;
import com.example.demo.repositories.DeviceUserMapRepository;
import com.example.demo.repositories.HourlyConsumptionRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MonitoringService {

    private final HourlyConsumptionRepository hourlyConsumptionRepository;
    private final DeviceUserMapRepository deviceUserMapRepository;
    private final RabbitTemplate rabbitTemplate;

    public MonitoringService(HourlyConsumptionRepository hourlyConsumptionRepository,
                             DeviceUserMapRepository deviceUserMapRepository, RabbitTemplate rabbitTemplate) {
        this.hourlyConsumptionRepository = hourlyConsumptionRepository;
        this.deviceUserMapRepository = deviceUserMapRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    // UPDATE/INSERT a.i. nimeni altcineva să nu intervina, sa nu se faca modificari deodata
    @Transactional
    public void processMeasurement(MeasurementDTO measurementDTO) {
        UUID deviceId = measurementDTO.getDeviceId();
        Double measurementValue = measurementDTO.getMeasurementValue();

        LocalDateTime measurementTime = measurementDTO.getTimestamp();

        //de ex 10:00:00
        LocalDateTime hourKey = measurementTime.truncatedTo(ChronoUnit.HOURS);

        Optional<HourlyConsumption> existingRecord =
                hourlyConsumptionRepository.findByDeviceIdAndHourTimestamp(deviceId, hourKey);

        HourlyConsumption recordToSave;

        if (existingRecord.isPresent()) {
            recordToSave = existingRecord.get();
            Double newTotal = recordToSave.getTotalConsumption() + measurementValue;
            recordToSave.setTotalConsumption(newTotal);

        } else {
            recordToSave = new HourlyConsumption();
            recordToSave.setDeviceId(deviceId);
            recordToSave.setHourTimestamp(hourKey);
            recordToSave.setTotalConsumption(measurementValue);
        }

        hourlyConsumptionRepository.save(recordToSave);

        Optional<DeviceUserMap> mapping = deviceUserMapRepository.findByDeviceId(measurementDTO.getDeviceId());

        if (mapping.isPresent()) {
            Double limit = mapping.get().getMaxConsumption();
            UUID userId = mapping.get().getUserId();

            if (measurementDTO.getMeasurementValue() > limit) {
                AlertDTO alert = new AlertDTO(
                        userId,
                        measurementDTO.getDeviceId(),
                        "Consum depășit!",
                        measurementDTO.getMeasurementValue()
                );

                rabbitTemplate.convertAndSend("overconsumption-queue", alert);
            }
        }
    }

    public List<HourlyConsumptionDTO> findConsumptionByDeviceId(UUID deviceId) {
        List<HourlyConsumption> consumptionList =
                hourlyConsumptionRepository.findByDeviceIdOrderByHourTimestampAsc(deviceId);

        return consumptionList.stream()
                .map(HourlyConsumptionBuilder::toDTO)
                .collect(Collectors.toList());
    }

    public List<DeviceUserMap> findDeviceMappingsByUserId(UUID userId) {
        return deviceUserMapRepository.findByUserId(userId);
    }
}