import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {BACKEND_PREFIX} from "../App";
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {useLocation} from "react-router-dom";


const Login = () => {
    const [loginData, setLoginData] = useState({
        email: "",
        pinNumber: ""
    });

    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorParam = params.get("error");
        if (errorParam) {
            setError("Login error " + decodeURIComponent(errorParam))
        }
    }, [location.search])


    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                BACKEND_PREFIX + "/login",
                loginData,
                {withCredentials: true}
            );
            if (response.status === 200) {
                setSuccess("Logged in succesfully.")
                setError("")
                setLoginData({
                    email: "",
                    pinNumber: ""
                })
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data || "Unexpected error occured.")
            } else {
                setError("Unexpected error occured.")
            }
        }
    };

    return (
        <Container>
            <Row className={"justify-content-center"}>
                <Col md={6}>
                    <h2>Login</h2>
                    <Form onSubmit={handleSubmit}>

                        <FormGroup>
                            <Label for={"email"}>Email</Label>
                            <Input
                                id={"email"}
                                type={"text"}
                                placeholder={"Enter your email."}
                                name={"email"}
                                value={loginData.email}
                                onChange={handleLoginChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for={"pinNumber"}>PIN number</Label>
                            <Input
                                id={"pinNumber"}
                                type={"password"}
                                placeholder={"Enter your PIN."}
                                name={"pinNumber"}
                                value={loginData.pinNumber}
                                onChange={handleLoginChange}
                            />
                        </FormGroup>

                        <Button color={"primary"} type={"submit"}>
                            Log in.
                        </Button>


                    </Form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </Col>
            </Row>

        </Container>
    )

}
export default Login;
