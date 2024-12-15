import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Col,
  Container,
  Row,
  Form,
  FormGroup,
  Label,
  Button,
  Input,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BACKEND_PREFIX } from "../App";
import { Link } from "react-router-dom";

const WorkerRegister = () => {
  const [formData, setFormData] = useState({
    pinNumber: "",
    name: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<any>([]);

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
        BACKEND_PREFIX + "/api/worker/register",
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        setSuccess("Registration successful!");
        setError("");
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
          if (err.response.data === "Worker already registered") {
            setError("Worker already registered");
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
          <Link to="/" className="btn-top-left-admin">
            Home
          </Link>
          <h2>Worker Register</h2>
          <Form onSubmit={handleSubmit} className="modern-form">
            <FormGroup className="form-group">
              <Label for="formPinNumber">PIN number</Label>
              <Input
                id="formPinNumber"
                type="text"
                placeholder="Enter your PIN number"
                name="pinNumber"
                value={formData.pinNumber}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            {errorMessages.pinNumber && (
              <div className="text-danger">{errorMessages.pinNumber}</div>
            )}

            <FormGroup className="form-group">
              <Label for="formName">Name</Label>
              <Input
                id="formName"
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            {errorMessages.name && (
              <div className="text-danger">{errorMessages.name}</div>
            )}

            <FormGroup className="form-group">
              <Label for="formEmail">Email</Label>
              <Input
                id="formEmail"
                type="text"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            {errorMessages.email && (
              <div className="text-danger">{errorMessages.email}</div>
            )}

            <FormGroup className="form-group">
              <Label for="formAddress">Address</Label>
              <Input
                id="formAddress"
                type="text"
                placeholder="Enter your address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
            </FormGroup>
            {errorMessages.address && (
              <div className="text-danger">{errorMessages.address}</div>
            )}

            <Button type="submit" className="btn-modern">
              Register
            </Button>
            <Link to="/worker-login" className="btn-link-modern">
              Already have Worker account?
            </Link>
          </Form>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default WorkerRegister;
