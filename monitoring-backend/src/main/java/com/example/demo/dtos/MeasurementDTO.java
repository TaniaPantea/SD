package com.example.demo.dtos;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementDTO implements Serializable {
    private UUID deviceId;
    private Double measurementValue;
    private LocalDateTime timestamp;

}
