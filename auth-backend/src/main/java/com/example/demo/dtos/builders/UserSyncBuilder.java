package com.example.demo.dtos.builders;

import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.entities.AuthUser;
import com.example.demo.entities.UserDetails;

public class UserSyncBuilder {

    private UserSyncBuilder() {
    }

    public static UserSyncDTO toUserSyncDTO(AuthUser authUser, UserDetails userDetails, String eventType) {

        String address = null;
        Integer age = null;

        if (userDetails != null) {
            address = userDetails.getAddress();
            age = userDetails.getAge();
        }


        return new UserSyncDTO(
                authUser.getId(),
                eventType,
                authUser.getEmail(),
                address,
                age,
                authUser.getName()
        );
    }
}