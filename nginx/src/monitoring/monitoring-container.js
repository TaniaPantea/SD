import React, { useState, useEffect } from 'react';
import { CardHeader, Col, Row, FormGroup, Label, Input } from 'reactstrap';
import * as deviceApi from '../device/api/device-api';
import * as monitoringApi from './api/monitoring-api';
import { getUserId } from '../commons/auth/jwt-utils';
import ConsumptionChart from './components/ConsumptionChart';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

function MonitoringContainer() {
    const [loading, setLoading] = useState(true);
    const [monitoringData, setMonitoringData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const userId = getUserId();

    useEffect(() => {
        if (userId) {
            fetchDevicesAndConsumption();
        }
    }, [userId, selectedDate]);

    function fetchDevicesAndConsumption() {
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
    }

    return (
        <div>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <strong>Historical Energy Consumption</strong>
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
                        <p className="text-center">Loading charts...</p>
                    ) : (
                        <>
                            {monitoringData.length === 0 && (
                                <div className="alert alert-info">No data for {selectedDate}.</div>
                            )}
                            {monitoringData.map(data => (
                                <ConsumptionChart key={data.deviceId} data={data} />
                            ))}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default MonitoringContainer;