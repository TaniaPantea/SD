package com.example.demo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceSyncDTO implements Serializable {
    private UUID deviceId;
    private UUID userId;
    private String eventType; // DEVICE_CREATED, DEVICE_UPDATED, DEVICE_DELETED
}