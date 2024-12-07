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
    const [errorMessages, setErrorMessages] = useState<any>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value } = e.target;
        if (/^\d+$/.test(value)) {
            setFormData({
                ...formData,
                pinNumber: value,
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await axios.post(
                "http://localhost:8080/register",
                formData,
                { withCredentials: true }
            );
            if (response.status === 201) {
                setSuccess('User ' + response.data.email + " Registered!");
                setError(""); // Clear any previous error message
                setFormData({
                    pinNumber: "",
                    name: "",
                    email: "",
                    address: "",
                });
            }
        } catch (err) {
            // Handle AxiosError specifically
            if (err instanceof AxiosError) {
                if (err.response?.status === 400) {
                    // Handle error message from backend
                    if (err.response.data === "User already registered") {
                        setError("User already registered");
                    } else {
                        // If other backend errors (like validation errors)
                        setErrorMessages(err.response.data);
                    }
                } else {
                    setError("An unexpected error occurred.");
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
                                onChange={handlePinChange}
                            />
                        </FormGroup>
                        {
                            errorMessages.pinNumber && (<div className={"text-danger"}>{errorMessages.pinNumber}</div>)
                        }

                        <FormGroup>
                            <Label for="formName">Name</Label>
                            <Input
                                id="formName"
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}

                            />
                        </FormGroup>
                        {
                            errorMessages.name && (<div className={"text-danger"}>{errorMessages.name}</div>)
                        }
                        <FormGroup>
                            <Label for="formEmail">Email</Label>
                            <Input
                                id="formEmail"
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        {
                            errorMessages.email && (<div className={"text-danger"}>{errorMessages.email}</div>)
                        }

                        <FormGroup>
                            <Label for="formAddress">Address</Label>
                            <Input
                                id="formAddress"
                                type="text"
                                placeholder="Enter your address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}

                            />
                        </FormGroup>
                        {
                            errorMessages.address && (<div className={"text-danger"}>{errorMessages.address}</div>)
                        }

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
