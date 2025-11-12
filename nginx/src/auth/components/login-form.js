import React, { useState } from 'react';
import { loginUser } from '../api/auth-api';
import {getUserRole} from "../../commons/auth/jwt-utils";
import { useHistory } from 'react-router-dom';
import { FormGroup, Label, Input } from "reactstrap";
import Button from "react-bootstrap/Button";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const history = useHistory();

    function handleSubmit() {
        loginUser({ email, password }, (result, status, err) => {
            if (status === 200 && result) { //result=token;
                console.log(result);
                localStorage.setItem('token', result.token);

                const role = getUserRole();
                console.log("User role:", role);

                localStorage.setItem("role", role);
                history.push('/');

            } else {
                setError(err || "Login failed");
            }
        });
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4 className="mb-4">Log In</h4>

            <FormGroup>
                <Label for="emailField">Email:</Label>
                <Input
                    type="email"
                    name="email"
                    id="emailField"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label for="passwordField">Password:</Label>
                <Input
                    type="password"
                    name="password"
                    id="passwordField"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </FormGroup>

            {error && <div className="mt-3 mb-3" style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

            <Button
                color="primary"
                onClick={handleSubmit}
                className="w-100 mt-3"
            >Login</Button>
        </div>
    );
}

export default LoginForm;
