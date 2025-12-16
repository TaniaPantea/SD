import React, { useState, useEffect } from 'react';
import { CardHeader, Col, Row } from 'reactstrap';

import * as deviceApi from '../device/api/device-api';
import * as monitoringApi from './api/monitoring-api';
import { getUserId } from '../commons/auth/jwt-utils';
import ConsumptionChart from './components/ConsumptionChart';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";


function MonitoringContainer() {
    const [loading, setLoading] = useState(true);
    const [userDevices, setUserDevices] = useState([]);
    const [monitoringData, setMonitoringData] = useState([]);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const userId = getUserId();

    useEffect(() => {
        if (userId) {
            fetchDevicesAndConsumption();
        } else {
            setLoading(false);
            setError({ status: 401, errorMessage: "User not authenticated or ID missing from token." });
        }
    }, [userId]);


    function fetchDevicesAndConsumption() {
        setLoading(true);
        setError({ status: 0, errorMessage: null });

        deviceApi.getActiveDevicesByUserId(userId, (result, status, err) => {
            if (result !== null && status === 200) {
                setUserDevices(result);
                fetchConsumptionForDevices(result);
            } else {
                setLoading(false);
                setError({ status, errorMessage: err });
            }
        });
    }

    function fetchConsumptionForDevices(devices) {
        // Cream un array de Promises pentru apeluri paralele (pentru performanta)
        const fetchPromises = devices.map(device => {
            return new Promise(resolve => {
                // Apelam Monitoring-Backend
                monitoringApi.getHourlyConsumption(device.id, (consumptionResult, status, err) => {
                    let aggregatedData = {
                        deviceId: device.id,
                        deviceName: device.name,
                        totalConsumption: 0,
                        hourlyData: []
                    };

                    if (consumptionResult !== null && status === 200) {
                        // Agregare: combinam numele dispozitivului cu datele de consum
                        let total = 0;
                        for (const item of consumptionResult) {
                            total += item.totalConsumption;
                        }
                        aggregatedData.totalConsumption = total;
                        aggregatedData.hourlyData = consumptionResult;
                    } else if (status !== 404) {
                        console.warn(`Could not fetch consumption for device ${device.name}, it doesnt have data:`, err);
                    }
                    // Rezolvam promisiunea indiferent de succes (pentru a nu bloca Promise.all)
                    resolve(aggregatedData);
                });
            });
        });

        // Asteptam ca toate apelurile paralele sa se termine
        Promise.all(fetchPromises).then(results => {
            setMonitoringData(results.filter(data => data.hourlyData.length > 0)); // Filtram cele fara date (optional)
            setLoading(false);
        });
    }

    return (
        <div>
            <CardHeader>
                <strong> Real-Time Consumption Overview </strong>
            </CardHeader>
            <br />
            <Row>
                <Col sm={{ size: '10', offset: 1 }}>
                    {loading &&
                        <div className="text-center">
                            <p>Loading consumption data...</p>
                        </div>
                    }

                    {error.status > 0 &&
                        <APIResponseErrorMessage
                            errorStatus={error.status}
                            error={error.errorMessage}
                        />}

                    {(!loading && monitoringData.length === 0 && error.status === 0) &&
                        <div className="alert alert-info">
                            No consumption data found for your active devices.
                        </div>
                    }

                    {/* Afisam graficele/listele pentru fiecare dispozitiv */}
                    {!loading && monitoringData.map(data => (
                        <ConsumptionChart key={data.deviceId} data={data} />
                    ))}
                </Col>
            </Row>
        </div>
    );
}

export default MonitoringContainer;