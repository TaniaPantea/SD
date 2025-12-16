import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

// Presupunem ca primeste un obiect din lista monitoringData
function ConsumptionChart({ data }) {
    const { deviceName, totalConsumption, hourlyData } = data;

    if (!hourlyData || hourlyData.length === 0) {
        return (
            <Card className="mb-4">
                <CardHeader className="bg-warning text-white">
                    <strong>Device: {deviceName}</strong> (Total: {totalConsumption.toFixed(2)} kWh)
                </CardHeader>
                <CardBody>
                    <p>No hourly data recorded yet for this device.</p>
                </CardBody>
            </Card>
        );
    }

    // Afișare simplă în listă (aici ar veni logica de grafic real)
    return (
        <Card className="mb-4">
            <CardHeader className="bg-primary text-white">
                <strong>Device: {deviceName}</strong> (Total: {totalConsumption.toFixed(2)} kWh)
            </CardHeader>
            <CardBody>
                <h6>Hourly Data Points:</h6>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {hourlyData.map((item, index) => (
                        <li key={index} className="mb-1">
                            Time: <strong>{new Date(item.hourTimestamp).toLocaleString()}</strong> - Value: **{item.totalConsumption.toFixed(3)} kWh**
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
}

export default ConsumptionChart;