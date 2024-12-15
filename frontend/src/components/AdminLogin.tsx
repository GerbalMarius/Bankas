import React, { useState } from "react";
import axios from "axios";
import { BACKEND_PREFIX } from "../App";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../adminlogin.css";

const AdminLogin = () => {
    const [loginData, setLoginData] = useState({
        email: "",
        pinNumber: ""
    });

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigation = useNavigate();

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                BACKEND_PREFIX + "/api/admin/login",
                loginData,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setSuccess("Admin logged in successfully!");
                setError("");
                setLoginData({
                    email: "",
                    pinNumber: ""
                });
                navigation("/admin-dashboard");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(err.response.data);
                } else {
                    setError("No response from server. Please try again later.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Link to="/" className="btn-top-left">Home</Link>
                    <h2>Admin Login</h2>
                    <Form onSubmit={handleSubmit} className="admin-login-form">
                        <FormGroup className="form-group">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="Enter your email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="form-control"
                            />
                        </FormGroup>

                        <FormGroup className="form-group">
                            <Label for="pinNumber">PIN number</Label>
                            <Input
                                id="pinNumber"
                                type="password"
                                placeholder="Enter your PIN"
                                name="pinNumber"
                                value={loginData.pinNumber}
                                onChange={handleLoginChange}
                                className="form-control"
                            />
                        </FormGroup>

                        <Button className="btn-admin" type="submit">
                            Log in as Admin
                        </Button>
                    </Form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;