package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class SyncedUser implements Serializable {

    @Id
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;
    private String name;

    public SyncedUser() {}
    public SyncedUser(UUID id,String name) { this.id = id; this.name = name; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}