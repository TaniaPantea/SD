import React, { useState, useEffect, useCallback } from 'react';
import { CardHeader, Col, Row, FormGroup, Label, Input } from 'reactstrap';
import * as monitoringApi from './api/monitoring-api';
import { connectToNotifications, disconnectFromNotifications } from './api/notification-api';
import { getUserId } from '../commons/auth/jwt-utils';
import ConsumptionChart from './components/ConsumptionChart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MonitoringContainer() {
    const [loading, setLoading] = useState(true);
    const [monitoringData, setMonitoringData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const userId = getUserId();

    //o funcție din useCallback se schimbă DOAR când se schimbă dependențele ei
    const fetchDevicesAndConsumption = useCallback(() => {
        setLoading(true);
        monitoringApi.getDevicesFromMonitoring(userId, (mappings, status, err) => {
            if (mappings !== null && status === 200) {
                const fetchPromises = mappings.map(mapping => {
                    return new Promise(resolve => {
                        monitoringApi.getHourlyConsumption(mapping.deviceId, (consumptionResult, status) => {
                            let aggregatedData = {
                                deviceId: mapping.deviceId,
                                deviceName: mapping.deviceName || "Unknown Device",
                                hourlyData: []
                            };

                            if (consumptionResult !== null && status === 200) {
                                aggregatedData.hourlyData = consumptionResult.filter(item => {
                                    const itemDate = new Date(item.hourTimestamp).toISOString().split('T')[0];
                                    return itemDate === selectedDate;
                                });
                            }
                            resolve(aggregatedData);
                        });
                    });
                });

                Promise.all(fetchPromises).then(results => {
                    setMonitoringData(results.filter(data => data.hourlyData.length > 0));
                    setLoading(false);
                });
            } else {
                setLoading(false);
                if (status !== 404) setError({ status, errorMessage: err });
            }
        });
    }, [userId, selectedDate]);

    //nu se face fecth la infinit pt ca o funcție din useCallback se schimbă DOAR când se schimbă dependențele ei
    useEffect(() => {
        if (userId) {
            fetchDevicesAndConsumption();
        }
    }, [userId, selectedDate, fetchDevicesAndConsumption]);

    useEffect(() => {
        const handleRefreshData = () => {
            console.log("Notificare primită, reîmprospătez datele...");
            fetchDevicesAndConsumption();
        };

        window.addEventListener("reload-monitoring-data", handleRefreshData);

        return () => {
            window.removeEventListener("reload-monitoring-data", handleRefreshData);
        };
    }, [fetchDevicesAndConsumption]);

    return (
        <div>
            <ToastContainer />

            <CardHeader className="d-flex justify-content-between align-items-center">
                <strong>Real-Time & Historical Monitoring</strong>
                <FormGroup className="mb-0 d-flex align-items-center">
                    <Label for="datePicker" className="mr-2 mb-0">Select Day: </Label>
                    <Input
                        type="date"
                        id="datePicker"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ width: 'auto' }}
                    />
                </FormGroup>
            </CardHeader>

            <br />

            <Row>
                <Col sm={{ size: '10', offset: 1 }}>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p>Loading energy dynamics...</p>
                        </div>
                    ) : (
                        <>
                            {monitoringData.length === 0 && (
                                <div className="alert alert-info">
                                    No consumption dynamics found for {selectedDate}.
                                </div>
                            )}
                            {monitoringData.map(data => (
                                <ConsumptionChart key={data.deviceId} data={data} />
                            ))}
                        </>
                    )}
                </Col>
            </Row>

            {error.status !== 0 && (
                <div className="alert alert-danger">
                    Error loading data: {error.errorMessage}
                </div>
            )}
        </div>
    );
}

export default MonitoringContainer;