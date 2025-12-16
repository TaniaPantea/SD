import React, { useState } from 'react';
import * as API_AUTH from '../api/auth-api';
import * as API_USERS from '../../user/api/user-api';
import { FormGroup, Label, Input } from "reactstrap";
import Button from "react-bootstrap/Button";


function RegisterForm({ onRegisterSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');

    const isFormValid = name.length > 2 && email.length > 5 && password.length > 2 && age>=18 && address.length > 1;


    function handleSubmit() {
        // MODIFICAT: Trimitem toate detaliile, inclusiv Address și Age
        const userDetails = { name, email, password, age: parseInt(age), address };

        API_AUTH.registerUser(userDetails, (authResult, authStatus, authErr) => {
            if (authStatus === 200 && authResult.userId) {


                API_AUTH.loginUser({email: userDetails.email, password: userDetails.password}, (authResult, authStatus, authErr) => {
                    if (authStatus === 200) {
                        localStorage.setItem('token', authResult.token);

                        onRegisterSuccess();

                    } else {
                        setError(authErr || "Registration succeeded, but auto-login failed.");
                    }
                });

            } else {
                setError(authErr || "Registration failed");
            }
        });

    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4 className="mb-4">Register New Account</h4>

            <FormGroup>
                <Label for="nameField">Name:</Label>
                <Input type="text" id="nameField" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name or Username" required />
            </FormGroup>

            <FormGroup>
                <Label for="emailField">Email:</Label>
                <Input type="email" id="emailField" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" required />
            </FormGroup>

            <FormGroup>
                <Label for="passwordField">Password:</Label>
                <Input type="password" id="passwordField" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" required />
            </FormGroup>

            <FormGroup>
                <Label for="ageField">Age:</Label>
                <Input type="number" id="ageField" value={age} onChange={e => setAge(e.target.value)} placeholder="Enter age" min={18} required />
            </FormGroup>

            <FormGroup>
                <Label for="addressField">Address:</Label>
                <Input type="text" id="addressField" value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter address" required />
            </FormGroup>

            {error && <div className="mt-3 mb-3" style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

            <Button
                color="success"
                onClick={handleSubmit}
                className="w-100 mt-3"
                disabled={!isFormValid}
            >
                Register
            </Button>
        </div>
    );
}

export default RegisterForm;
