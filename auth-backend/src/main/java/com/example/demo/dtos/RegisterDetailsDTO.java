package com.example.demo.dtos;


import jakarta.validation.constraints.NotBlank;

import java.util.Objects;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;

public class RegisterDetailsDTO {

    private UUID id;

    @NotBlank(message = "name is required")
    private String name;
    @NotBlank(message = "password is required")
    private String password;
    @NotBlank(message = "email is required")
    private String email;
    private String role;
    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Age is required")
    private Integer age;

    public RegisterDetailsDTO() {
    }

    public RegisterDetailsDTO(String name, String password, String email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public RegisterDetailsDTO(UUID id, String name, String password, String email, String role, String address, Integer age) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = role;
        this.address = address;
        this.age = age;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RegisterDetailsDTO that = (RegisterDetailsDTO) o;
        return email == that.email &&
                Objects.equals(name, that.name) &&
                Objects.equals(password, that.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, password, email);
    }
}
