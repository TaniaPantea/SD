package com.example.demo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncDTO implements Serializable {
    // deserializa mesajul de la RabbitMQ
    private UUID userId;
    private String eventType;

    // Urmatoarele campuri sunt incluse pentru compatibilitatea cu DTO-ul complet,
    // chiar daca Demo-Backend le trimite null/goale in acest eveniment
    private String name;
    private String email;
    private String role;
    private String address;
    private Integer age;
}