import React, { useState } from "react";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import { useHistory } from "react-router-dom";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import Button from "react-bootstrap/Button";

function AuthContainer() {
    const [isLogin, setIsLogin] = useState(true);
    const history = useHistory();

    /**
     * Setează starea pe Login. Această funcție este pasată către RegisterForm
     * și este apelată când înregistrarea este finalizată cu succes.
     */
    function handleRegisterSuccess() {
        history.push("/");
    }

    return (
        <Row className="justify-content-center mt-5">
            <Col sm="12" md="8" lg="6" xl="4">
                <Card>
                    <CardHeader className="text-center">
                        <h4>{isLogin ? "Sign In" : "Create Account"}</h4>
                    </CardHeader>

                    <CardBody>
                        {isLogin ? (<LoginForm />) : (
                            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
                        )}

                        <hr className="mt-4 mb-3" />

                        <div className="text-center">
                            <Button
                                color="link"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-white"
                            >
                                {isLogin ?
                                    "Need an account? Register here." :
                                    "Already have an account? Log in."
                                }
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default AuthContainer;