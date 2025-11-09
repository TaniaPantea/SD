package com.example.demo.dtos;

import java.util.Objects;
import java.util.UUID;

public class LoginDTO {
    private UUID id;
    private String password;
    private String email;

    public LoginDTO() {}
    public LoginDTO(UUID id, String password, String email) {
        this.id = id; this.password = password; this.email = email;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LoginDTO that = (LoginDTO) o;
        return email == that.email && Objects.equals(password, that.password);
    }
    @Override public int hashCode() { return Objects.hash(password, email); }
}
