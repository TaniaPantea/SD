package com.example.demo.repositories;

import com.example.demo.entities.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuthRepository extends JpaRepository<AuthUser, UUID> {

    /**
     * Example: JPA generate query by existing field
     */
    Optional<AuthUser> findByEmail(String email);

    /**
     * Example: Custom query
     */

}
