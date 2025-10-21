package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Example: JPA generate query by existing field
     */
    List<User> findByUsername(String username);

    /**
     * Example: Custom query
     */
    @Query(value = "SELECT p " +
            "FROM User p " +
            "WHERE p.username = :name " +
            "AND p.age >= 60  ")
    Optional<User> findSeniorsByName(@Param("username") String name);

}
