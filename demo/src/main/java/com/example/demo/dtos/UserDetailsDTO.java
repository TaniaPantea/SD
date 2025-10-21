package com.example.demo.dtos;


import com.example.demo.dtos.validators.annotation.AgeLimit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Objects;
import java.util.UUID;

public class UserDetailsDTO {

    private UUID id;

    @NotBlank(message = "username is required")
    private String username;
    @NotBlank(message = "address is required")
    private String address;
    @NotNull(message = "age is required")
    @AgeLimit(value = 18)
    private Integer age;
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private String fullName;

    public UserDetailsDTO() {
    }

    public UserDetailsDTO(UUID id, String username, String address, int age, String fullName, String password) {
        this.id = id;
        this.username = username;
        this.address = address;
        this.age = age;
        this.fullName = fullName;
        this.password = password;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsDTO that = (UserDetailsDTO) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(username, that.username) &&
                Objects.equals(address, that.address) &&
                Objects.equals(age, that.age) &&
                Objects.equals(fullName, that.fullName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, address, age, fullName);
    }

}
