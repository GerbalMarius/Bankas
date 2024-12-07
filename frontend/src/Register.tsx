import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Col, Container, Row, Form, FormGroup, Label, Button, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
    const [formData, setFormData] = useState({
        pinNumber: "",
        name: "",
        email: "",
        address: "",
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/register",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials : true,
                }
            );
            if (response.status === 201) {
                setSuccess("User registered successfully");
                setError("");
                setFormData({
                    pinNumber: "",
                    name: "",
                    email: "",
                    address: "",
                });
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                // Handle AxiosError specifically
                setError(err.response?.data.message || "Registration failed");
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2>Register</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="formPinNumber">PIN number</Label>
                            <Input
                                id="formPinNumber"
                                type="text"
                                placeholder="Enter your PIN number"
                                name="pinNumber"
                                value={formData.pinNumber}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="formName">Name</Label>
                            <Input
                                id="formName"
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="formEmail">Email</Label>
                            <Input
                                id="formEmail"
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="formAddress">Address</Label>
                            <Input
                                id="formAddress"
                                type="text"
                                placeholder="Enter your address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <Button color="primary" type="submit">
                            Register
                        </Button>
                    </Form>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
