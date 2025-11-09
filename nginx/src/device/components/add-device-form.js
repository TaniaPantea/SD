import React, { useState } from 'react';
import { Col, Row, FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

function AddDeviceForm({ reloadHandler, users }) {
    const formControlsInit = {
        name: {
            value: '',
            placeholder: 'Device name...',
            valid: false,
            touched: false,
            validationRules: { minLength: 3, isRequired: true }
        },
        maxConsumption: {
            value: '',
            placeholder: 'Max consumption (kW)...',
            valid: false,
            touched: false,
            validationRules: { isRequired: true }
        },
        userId: {
            value: '',
            valid: false,
            touched: false,
            validationRules: { isRequired: true }
        },
        active: {
            value: true
        }
    };

    const [formControls, setFormControls] = useState(formControlsInit);
    const [formIsValid, setFormIsValid] = useState(false);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    function handleChange(event) {
        const name = event.target.name;
        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        const updatedControls = { ...formControls };
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = value !== ''; // simplu valid pentru toate câmpurile
        updatedControls[name] = updatedFormElement;

        let formValid = true;
        for (let key in updatedControls) {
            if (updatedControls[key].validationRules) {
                formValid = updatedControls[key].valid && formValid;
            }
        }

        setFormControls(updatedControls);
        setFormIsValid(formValid);
    }

    function handleSubmit() {
        const device = {
            name: formControls.name.value,
            maxConsumption: parseFloat(formControls.maxConsumption.value),
            userId: formControls.userId.value,
            active: formControls.active.value
        };

        console.log(device);
        API_DEVICES.postDevice(device, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
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
                    placeholder={formControls.maxConsumption.placeholder}
                    type="number"
                    min={0}
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
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
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
                    <Button type="submit" disabled={!formIsValid} onClick={handleSubmit}>Submit</Button>
                </Col>
            </Row>

            {error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />}
        </div>
    );
}

export default AddDeviceForm;
