package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;


@Entity
public class UserDetails implements Serializable {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    private AuthUser authUser;

    @Column(name = "address")
    private String address;

    @Column(name = "age")
    private Integer age;

    public UserDetails() {}

    public UserDetails(String address, Integer age) {
        this.address = address;
        this.age = age;
    }

    public void setAuthUser(AuthUser authUser) {
        this.authUser = authUser;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public AuthUser getAuthUser() {
        return authUser;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}