package com.example.demo.dtos.builders;

import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.RegisterDetailsDTO;
import com.example.demo.entities.AuthUser;

public class AuthBuilder {

    private AuthBuilder() {
    }

    public static LoginDTO toLoginDTO(AuthUser authUser) {
        return new LoginDTO(authUser.getId(), authUser.getName(), authUser.getEmail());
    }

    public static RegisterDetailsDTO toRegisterDetailsDTO(AuthUser authUser) {
        return new RegisterDetailsDTO(authUser.getId(), authUser.getName(), authUser.getPassword(), authUser.getEmail());
    }

    public static AuthUser toEntity(RegisterDetailsDTO registerDetailsDTO) {
        return new AuthUser(registerDetailsDTO.getName(),
                registerDetailsDTO.getPassword(),
                registerDetailsDTO.getEmail());
    }
}
