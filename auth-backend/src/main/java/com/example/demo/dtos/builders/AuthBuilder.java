package com.example.demo.dtos.builders;

import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.RegisterDetailsDTO;
import com.example.demo.entities.AuthUser;
import com.example.demo.entities.UserDetails;

public class AuthBuilder {

    private AuthBuilder() {
    }

    public static LoginDTO toLoginDTO(AuthUser authUser) {
        return new LoginDTO(authUser.getId(), authUser.getName(), authUser.getEmail());
    }

    public static AuthUser toEntity(RegisterDetailsDTO registerDetailsDTO) {
        AuthUser authUser = new AuthUser(registerDetailsDTO.getName(),
                registerDetailsDTO.getPassword(),
                registerDetailsDTO.getEmail(),
                registerDetailsDTO.getRole());

        UserDetails userDetails = new UserDetails(registerDetailsDTO.getAddress(),
                registerDetailsDTO.getAge());

        authUser.setUserDetails(userDetails);

        return authUser;
    }
}
