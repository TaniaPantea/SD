import React, { useState, useEffect } from 'react';
import { Col, Row, FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

function EditDeviceForm({ device, users, reloadHandler }) {
    const formControlsInit = {
        name: {
            value: '',
            placeholder: 'Device name...',
            valid: false,
            touched: false
        },
        maxConsumption: {
            value: '',
            placeholder: 'Max consumption...',
            valid: false,
            touched: false
        },
        userId: {
            value: '',
            valid: false,
            touched: false
        },
        active: {
            value: true
        }
    };

    const [formControls, setFormControls] = useState(formControlsInit);
    const [formIsValid, setFormIsValid] = useState(false);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    useEffect(() => {
        if (device) {
            setFormControls({
                name: { ...formControls.name, value: device.name, valid: true, touched: true },
                maxConsumption: { ...formControls.maxConsumption, value: device.maxConsumption, valid: true, touched: true },
                userId: { ...formControls.userId, value: device.userId, valid: true, touched: true },
                active: { ...formControls.active, value: device.active }
            });
            setFormIsValid(true);
        }
    }, [device]);

    function handleChange(event) {
        const name = event.target.name;
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        const updatedControls = { ...formControls };
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = value !== ''; // simplu valid
        updatedControls[name] = updatedFormElement;

        let formValid = true;
        for (let key in updatedControls) {
            if (updatedControls[key].touched) {
                formValid = updatedControls[key].valid && formValid;
            }
        }

        setFormControls(updatedControls);
        setFormIsValid(formValid);
    }

    function handleSubmit() {
        const updatedDevice = {
            id: device.id,
            name: formControls.name.value,
            maxConsumption: parseFloat(formControls.maxConsumption.value),
            userId: formControls.userId.value,
            active: formControls.active.value
        };

        API_DEVICES.putDevice(updatedDevice, (result, status, err) => {
            if (result !== null && status === 200) {
                reloadHandler();
            } else {
                setError({ status, errorMessage: err });
            }
        });
    }

    return (
        <div>
            <FormGroup>
                <Label for='nameField'>Device Name:</Label>
                <Input
                    name='name'
                    id='nameField'
                    placeholder={formControls.name.placeholder}
                    value={formControls.name.value}
                    onChange={handleChange}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label for='maxConsumptionField'>Max Consumption:</Label>
                <Input
                    name='maxConsumption'
                    id='maxConsumptionField'
                    type="number"
                    min={0}
                    placeholder={formControls.maxConsumption.placeholder}
                    value={formControls.maxConsumption.value}
                    onChange={handleChange}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label for='userSelect'>User:</Label>
                <Input
                    type="select"
                    name="userId"
                    id="userSelect"
                    value={formControls.userId.value}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select User --</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                </Input>
            </FormGroup>

            <FormGroup check>
                <Label check>
                    <Input
                        type="checkbox"
                        name="active"
                        checked={formControls.active.value}
                        onChange={handleChange}
                    /> Active
                </Label>
            </FormGroup>

            <Row>
                <Col sm={{ size: '4', offset: 8 }}>
                    <Button type="submit" disabled={!formIsValid} onClick={handleSubmit}>Update</Button>
                </Col>
            </Row>

            {error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />}
        </div>
    );
}

export default EditDeviceForm;
