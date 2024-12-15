import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_PREFIX } from "../App";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

const WorkerLogin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    pinNumber: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigation = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.search === "?error") {
      setError("Worker Login error ");
    }
    if (location.search === "?logout") {
      setSuccess("Logged out successfully!");
    }
  }, [location.search]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh on form submission

    try {
      const response = await axios.post(
        BACKEND_PREFIX + "/api/worker/login", // Backend endpoint
        loginData,
        { withCredentials: true } // Include cookies for sessions, if applicable
      );

      if (response.status === 200) {
        // Success case
        setSuccess(response.data.message || "Logged in successfully!"); // Use the backend message if sent
        setError(""); // Clear any prior error message
        setLoginData({
          email: "",
          pinNumber: "",
        });
        navigation("/worker-dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle backend responses properly
        if (err.response) {
          // Backend returned a response with an error code
          switch (err.response.status) {
            case 400: {
              setError(err.response.data);
              break;
            }
            case 401: {
              setError(err.response.data);
              break;
            }
            case 403: {
              setError(err.response.data);
              break;
            }
            case 500: {
              setError(err.response.data);
              break;
            }
            default: {
              setError(err.response.data);
            }
          }
        } else if (err.request) {
          // Request was sent, but no response was received (network or backend issue)
          setError("No response from server. Please try again later.");
        } else {
          // Some other error happened while setting up the request
          setError(err.message || "Unexpected error occurred.");
        }
      } else {
        // Unknown error (non-axios related)
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Link to="/" className="btn-top-left">
            Home
          </Link>
          <h2>Worker Login</h2>
          <Form onSubmit={handleSubmit} className="modern-form">
            <FormGroup className="form-group">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email."
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
                placeholder="Enter your PIN."
                name="pinNumber"
                value={loginData.pinNumber}
                onChange={handleLoginChange}
                className="form-control"
              />
            </FormGroup>

            <Button className="btn-modern" type="submit">
              Log in as Worker
            </Button>
          </Form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </Col>
      </Row>
    </Container>
  );
};
export default WorkerLogin;
