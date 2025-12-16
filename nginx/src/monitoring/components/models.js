// Structura primita din Device-Backend (DeviceDetailsDTO)
export const initialDeviceDetails = {
    id: null,
    name: "Unknown Device",
    maxConsumption: 0,
    userId: null,
    isActive: false,
};

// Structura primita din Monitoring-Backend (HourlyConsumptionDTO)
export const initialHourlyConsumption = {
    hourTimestamp: null,
    totalConsumption: 0,
};

// Structura pentru datele agregate finale, gata de afișare (MonitoringData)
export const initialMonitoringData = {
    deviceId: null,
    deviceName: "Loading...",
    totalConsumption: 0,
    hourlyData: [],
};