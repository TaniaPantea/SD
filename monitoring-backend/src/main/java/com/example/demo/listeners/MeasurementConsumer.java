package com.example.demo.listeners;

import com.example.demo.dtos.MeasurementDTO;
import com.example.demo.services.MonitoringService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class MeasurementConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MeasurementConsumer.class);

    private final MonitoringService monitoringService;

    public MeasurementConsumer(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }


    @RabbitListener(queues = "${rabbitmq.queue.measurement}")
    public void handleMeasurement(MeasurementDTO measurementDTO) {
        LOGGER.info("Received measurement: Device={}, Value={}, Timestamp={}",
                measurementDTO.getDeviceId(),
                measurementDTO.getMeasurementValue(),
                measurementDTO.getTimestamp());

        try {
            monitoringService.processMeasurement(measurementDTO);

        } catch (Exception e) {
            LOGGER.error("Error processing measurement from device {}: {}", measurementDTO.getDeviceId(), e.getMessage());

            // mesajul se pune in coada de asteptare requeue din cauza la ce am pus in properties
        }
    }
}