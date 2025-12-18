package com.example.demo.controllers;

import com.example.demo.dtos.HourlyConsumptionDTO;
import com.example.demo.entities.DeviceUserMap;
import com.example.demo.services.MonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<List<HourlyConsumptionDTO>> getHourlyConsumptionByDeviceId(@PathVariable UUID deviceId) {

        List<HourlyConsumptionDTO> consumptionData = monitoringService.findConsumptionByDeviceId(deviceId);

        return ResponseEntity.ok(consumptionData);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DeviceUserMap>> getDevicesByUserId(@PathVariable UUID userId) {
        List<DeviceUserMap> mappings = monitoringService.findDeviceMappingsByUserId(userId);
        return ResponseEntity.ok(mappings);
    }

}