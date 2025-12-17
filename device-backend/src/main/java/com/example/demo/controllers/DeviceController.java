package com.example.demo.controllers;

import com.example.demo.dtos.DeviceDTO;
import com.example.demo.dtos.DeviceDetailsDTO;
import com.example.demo.entities.Device;
import com.example.demo.services.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/devices")
@Validated
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<List<DeviceDetailsDTO>> getDevices() {
        return ResponseEntity.ok(deviceService.findDevices());
    }

    @PostMapping
    public ResponseEntity<DeviceDetailsDTO> create(@Valid @RequestBody DeviceDetailsDTO device) {
        UUID id = deviceService.insert(device);
        device.setId(id);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body(device);
    }


    @GetMapping("/{id}")
    public ResponseEntity<DeviceDetailsDTO> getDevice(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceService.findDeviceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceDetailsDTO> update(@PathVariable UUID id, @Valid @RequestBody DeviceDetailsDTO device) {
        return ResponseEntity.ok(deviceService.update(id, device));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        deviceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<DeviceDetailsDTO>> findDevicesByName(@RequestParam String name) {
        List<DeviceDetailsDTO> device = deviceService.findByName(name);
        return ResponseEntity.ok(device);
    }

    @GetMapping("/by-userId")
    public ResponseEntity<List<DeviceDetailsDTO>> findDevicesByUserId(@RequestParam UUID userId) {
        List<DeviceDetailsDTO> device = deviceService.findActiveDevicesByUserId(userId);
        return ResponseEntity.ok(device);
    }

    @GetMapping("/active-ids")
    public List<UUID> getAllActiveDeviceIds() {
        return deviceService.findAllActiveDeviceIds();
    }


}
