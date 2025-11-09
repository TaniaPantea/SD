import React, { useState, useEffect } from 'react';
import { Col, Row, FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import Validate from "./validators/user-validators";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

function EditUserForm({ user, reloadHandler }) {
    const formControlsInit = {
        username: {
            value: '',
            placeholder: 'What is your username?...',
            valid: false,
            touched: false,
            validationRules: { minLength: 3, isRequired: true }
        },
        email: {
            value: '',
            placeholder: 'Email...',
            valid: false,
            touched: false,
            validationRules: { emailValidator: true }
        },
        age: {
            value: '',
            placeholder: 'Age...',
            valid: false,
            touched: false,
        },
        address: {
            value: '',
            placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
            valid: false,
            touched: false,
        },
    };

    const [formControls, setFormControls] = useState(formControlsInit);
    const [formIsValid, setFormIsValid] = useState(false);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    // Populam formul cu valorile userului la montare sau la schimbarea userului
    useEffect(() => {
        if (user) {
            setFormControls({
                username: { ...formControls.username, value: user.username, valid: true, touched: true },
                email: { ...formControls.email, value: user.email, valid: true, touched: true },
                age: { ...formControls.age, value: user.age, valid: true, touched: true },
                address: { ...formControls.address, value: user.address, valid: true, touched: true },
            });
            setFormIsValid(true);
            console.log(user);
        }
    }, [user]);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = { ...formControls };
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = Validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formValid = true;
        for (let key in updatedControls) {
            formValid = updatedControls[key].valid && formValid;
        }

        setFormControls(updatedControls);
        setFormIsValid(formValid);
    }

    function handleSubmit() {
        const updatedUser = {
            id: user.id, // ne trebuie id-ul pentru PUT
            username: formControls.username.value,
            email: formControls.email.value,
            age: formControls.age.value,
            address: formControls.address.value
        };

        API_USERS.putUser(updatedUser, (result, status, err) => {
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
                <Label for='usernameField'> Username: </Label>
                <Input
                    name='username'
                    id='usernameField'
                    placeholder={formControls.username.placeholder}
                    value={formControls.username.value}
                    onChange={handleChange}
                    required
                />
                {formControls.username.touched && !formControls.username.valid &&
                    <div className="error-message row">* username must have at least 3 characters</div>}
            </FormGroup>

            <FormGroup>
                <Label for='emailField'> Email: </Label>
                <Input
                    name='email'
                    id='emailField'
                    placeholder={formControls.email.placeholder}
                    value={formControls.email.value}
                    onChange={handleChange}
                    required
                />
                {formControls.email.touched && !formControls.email.valid &&
                    <div className="error-message">* Email must have a valid format</div>}
            </FormGroup>

            <FormGroup>
                <Label for='addressField'> Address: </Label>
                <Input
                    name='address'
                    id='addressField'
                    placeholder={formControls.address.placeholder}
                    value={formControls.address.value}
                    onChange={handleChange}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label for='ageField'> Age: </Label>
                <Input
                    name='age'
                    id='ageField'
                    placeholder={formControls.age.placeholder}
                    type="number"
                    min={0}
                    max={100}
                    value={formControls.age.value}
                    onChange={handleChange}
                    required
                />
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

export default EditUserForm;
