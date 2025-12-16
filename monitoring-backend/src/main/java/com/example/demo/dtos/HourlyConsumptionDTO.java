package com.example.demo.dtos;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HourlyConsumptionDTO {
    private UUID deviceId;
    private LocalDateTime hourTimestamp;
    private Double totalConsumption;
}