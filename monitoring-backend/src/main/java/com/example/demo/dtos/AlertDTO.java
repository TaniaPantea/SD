package com.example.demo.dtos;

import java.util.UUID;

public class AlertDTO {
    private UUID userId;
    private UUID deviceId;
    private String message;
    private Double measurementValue;
    private String deviceName;

    public AlertDTO() {}

    public AlertDTO(UUID userId, UUID deviceId, String message, Double measurementValue, String deviceName) {
        this.userId = userId;
        this.deviceId = deviceId;
        this.message = message;
        this.measurementValue = measurementValue;
        this.deviceName = deviceName;
    }

    // Getters și Setters
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getDeviceId() { return deviceId; }
    public void setDeviceId(UUID deviceId) { this.deviceId = deviceId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getMeasurementValue() {
        return measurementValue;
    }
    public void setMeasurementValue(Double measurementValue) { this.measurementValue = measurementValue; }
    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
}