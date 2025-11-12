import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import AddDeviceForm from "./components/add-device-form";
import EditDeviceForm from "./components/edit-device-form";
import DeviceTable from "./components/device-table";
import * as API_DEVICES from "./api/device-api";
import * as API_USERS from "../user/api/user-api";


function DeviceContainer(props) {
    const [isSelected, setIsSelected] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [users, setUsers] = useState([]); // lista de users pentru dropdown
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    // componentDidMount
    useEffect(() => {
        fetchDevices();
        fetchUsers();
    }, []);

    function fetchDevices() {
        API_DEVICES.getDevices((result, status, err) => {
            if (result !== null && status === 200) {
                setTableData(result);
                setIsLoaded(true);
            } else {
                setError({ status, errorMessage: err });
            }
        });
    }

    function fetchUsers() {
        API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                setUsers(result);
            } else {
                console.error("Error fetching users for DeviceContainer", err);
            }
        });
    }

    function toggleForm() {
        setIsSelected(!isSelected);
    }

    function reload() {
        setIsLoaded(false);
        setSelectedDevice(null);
        toggleForm();
        fetchDevices();
    }

    function reloadDelete(){
        setIsLoaded(false);
        setSelectedDevice(null);
        fetchDevices();
    }

    function openEditForm(device) {
        setSelectedDevice(device);
        setIsSelected(true);
    }

    return (
        <div>
            <CardHeader>
                <strong> Device Management </strong>
            </CardHeader>
            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <Button color="primary" onClick={toggleForm}>Add Device</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col sm={{ size: '10', offset: 1 }}>
                        {isLoaded &&
                            <DeviceTable
                                tableData={tableData}
                                openEditForm={openEditForm}
                                reloadHandler={reload}
                                reloadDelete={reloadDelete}
                                users={users}
                            />}
                        {error.status > 0 &&
                            <APIResponseErrorMessage
                                errorStatus={error.status}
                                error={error.errorMessage}
                            />}
                    </Col>
                </Row>
            </Card>

            <Modal isOpen={isSelected} toggle={toggleForm} size="lg">
                <ModalHeader toggle={toggleForm}>
                    {selectedDevice ? "Edit Device" : "Add Device"}
                </ModalHeader>
                <ModalBody>
                    {selectedDevice ? (
                        <EditDeviceForm reloadHandler={reload} device={selectedDevice} users={users} />
                    ) : (
                        <AddDeviceForm reloadHandler={reload} users={users} />
                    )}
                </ModalBody>
            </Modal>
        </div>
    );
}

export default DeviceContainer;
