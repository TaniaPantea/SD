package com.example.demo.dtos.builders;

import com.example.demo.dtos.HourlyConsumptionDTO;
import com.example.demo.entities.HourlyConsumption;

public class HourlyConsumptionBuilder {

    private HourlyConsumptionBuilder() {
    }

    public static HourlyConsumptionDTO toDTO(HourlyConsumption hourlyConsumption) {
        HourlyConsumptionDTO dto = new HourlyConsumptionDTO();
        dto.setDeviceId(hourlyConsumption.getDeviceId());
        dto.setHourTimestamp(hourlyConsumption.getHourTimestamp());
        dto.setTotalConsumption(hourlyConsumption.getTotalConsumption());
        return dto;
    }

    public static HourlyConsumption toEntity(HourlyConsumptionDTO dto) {
        HourlyConsumption entity = new HourlyConsumption();
        entity.setDeviceId(dto.getDeviceId());
        entity.setHourTimestamp(dto.getHourTimestamp());
        entity.setTotalConsumption(dto.getTotalConsumption());
        return entity;
    }
}