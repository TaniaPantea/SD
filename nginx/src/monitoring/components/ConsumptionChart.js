import React, { useState } from 'react';
import { Card, CardBody, CardHeader, ButtonGroup, Button } from 'reactstrap';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function ConsumptionChart({ data }) {
    const [chartType, setChartType] = useState('bar');
    const { deviceName, hourlyData } = data;

    //OX: ora, OY: val
    const chartData = hourlyData.map(item => ({
        hour: new Date(item.hourTimestamp).getHours() + ":00",
        consumption: item.totalConsumption
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    //parseInt ia doar ce e inainte de : ex 13:00

    return (
        <Card className="mb-4 shadow-sm">
            <CardHeader className="bg-white d-flex justify-content-between align-items-center">
                <strong>Device: {deviceName}</strong>
                <ButtonGroup size="sm">
                    <Button
                        color="primary"
                        outline
                        onClick={() => setChartType('bar')}
                        active={chartType === 'bar'}
                    >Bar</Button>
                    <Button
                        color="primary"
                        outline
                        onClick={() => setChartType('line')}
                        active={chartType === 'line'}
                    >Line</Button>
                </ButtonGroup>
            </CardHeader>
            <CardBody>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        {chartType === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} />
                                <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Bar dataKey="consumption" fill="#8884d8" />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="consumption" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
}

export default ConsumptionChart;