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
    private UUID userId;
    private String eventType; // Ex: USER_CREATED, USER_UPDATED, USER_DELETED
    private String email;
    private String address;
    private Integer age;
    private String name;
}