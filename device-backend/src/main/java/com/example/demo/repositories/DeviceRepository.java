package com.example.demo.repositories;

import com.example.demo.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    /**
     * Example: JPA generate query by existing field
     */
    List<Device> findByName(String name);

    /**
     * Example: Custom query
     */
    @Query("SELECT d FROM Device d WHERE d.userId = :userId AND d.active = true")
    List<Device> findActiveDevicesByUserId(@Param("userId") UUID userId);

}
