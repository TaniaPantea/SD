package com.example.demo.repositories;

import com.example.demo.entities.DeviceUserMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceUserMapRepository extends JpaRepository<DeviceUserMap, UUID> {
    List<DeviceUserMap> findByUserId(UUID userId);
}