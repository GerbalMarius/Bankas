import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {BACKEND_PREFIX, User} from "../App";
import {Link, useNavigate} from "react-router-dom";
import {Col, Container, Row, Form, FormGroup, Label, Button, Input} from "reactstrap";
import Select from "react-select";
import {fetchUserRoles} from "../userapi";

const BankAccCreationForm = () => {
    const [user, setUser] = useState<User | null>(null)
    const [roles, setRoles] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        balance: "",
        reservedBalance: "",
        dailyLimit: "",
        monthlyLimit: "",
        accountName: "",
        currencyType: ""
    })
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<any>([]);
    const navigate = useNavigate();

    const currencyOptions = ["USD", "EUR", "GBP", "PLN", "JPY"]

    useEffect(() => {
        const contr = new AbortController();
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>(
                    `${BACKEND_PREFIX}/api/user/current`,
                    {signal: contr.signal}
                )
                setUser(response.data)
            } catch (err) {
                if (!contr.signal.aborted) {
                    setUser(null);
                    navigate("/login");
                }
            }
            const roles = await fetchUserRoles();
            console.log(roles);
            if (roles === null){
                setUser(null);
                navigate("/login");
            }else{
                setRoles(roles);
                if (roles.find(role => role === "USER") === undefined){
                    setUser(null);
                    navigate("/login");//change to diff login if admin or worker
                }
            }
        }

        fetchUser();
        return () => contr.abort();
    }, [navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${BACKEND_PREFIX}/api/accounts/create`,
                formData,
                {withCredentials: true}
            )
            if (response.status === 201) {
                setSuccess("Account opened successfully!");
                setError("")
                setFormData({
                    balance: "",
                    reservedBalance: "",
                    dailyLimit: "",
                    monthlyLimit: "",
                    accountName: "",
                    currencyType: ""
                })
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 400) {
                    setErrorMessages(err.response.data);
                } else {
                    setError("An unexpected error occurred.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Link to={"/"} className={"btn-top-left"}>Home</Link>
                    <h2>Open a bank account for {user?.name}</h2>
                    <Form className={"modern-form"} onSubmit={handleSubmit}>
                        <FormGroup className={"form-group"}>
                            <Label for={"accountName"}>Account name</Label>
                            <Input
                                id={"accountName"}
                                type={"text"}
                                placeholder={"Enter an account name"}
                                name={"accountName"}
                                value={formData.accountName}
                                onChange={handleChange}
                                className={"form-control"}
                            />
                        </FormGroup>
                        {errorMessages.accountName && (
                            <div className={"text-danger"}>{errorMessages.accountName}</div>
                        )}
                        <FormGroup className="form-group">
                            <Label for="currencyType">Currency type</Label>
                            <Select
                                id="currencyType"
                                name="currencyType"
                                value={{ value: formData.currencyType, label: formData.currencyType }}
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        currencyType: selectedOption?.value || "",
                                    })
                                }
                                options={currencyOptions.map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                className="modern-select" // Ensures custom styling if needed
                                classNamePrefix="react-select" // Use custom prefix for styling React-Select elements
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderRadius: "0.25rem", // Matches Input borders (Bootstrap style)
                                        borderColor: "#ced4da", // Match default border color
                                        height: "calc(1.5em + 0.75rem + 2px)", // Form-control height
                                        fontSize: "1rem", // Ensure text size consistency
                                        boxShadow: "none", // No shadow on default
                                        "&:hover": {
                                            borderColor: "#80bdff", // Match hover styling like Bootstrap
                                        },
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 1050, // Works well with Bootstrap modals if used
                                    }),
                                }}
                            />
                        </FormGroup>
                        {errorMessages.currencyType && (
                            <div className={"text-danger"}>{errorMessages.currencyType}</div>
                        )}
                        <FormGroup className="form-group">
                            <Label for="balance">Balance</Label>
                            <Input
                                id="balance"
                                type="text"
                                placeholder="Enter your balance"
                                name="balance"
                                value={formData.balance}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </FormGroup>
                        {errorMessages.balance && (
                            <div className={"text-danger"}>{errorMessages.balance}</div>
                        )}
                        <FormGroup className="form-group">
                            <Label for="dailyLimit">Initial Daily limit</Label>
                            <Input
                                id="dailyLimit"
                                type="text"
                                placeholder="Enter your daily limit"
                                name="dailyLimit"
                                value={formData.dailyLimit}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </FormGroup>
                        {errorMessages.dailyLimit && (
                            <div className={"text-danger"}>{errorMessages.dailyLimit}</div>
                        )}
                        <FormGroup className="form-group">
                            <Label for="monthlyLimit">Monthly limit</Label>
                            <Input
                                id="monthlyLimit"
                                type="text"
                                placeholder="Enter your monthly limit"
                                name="monthlyLimit"
                                value={formData.monthlyLimit}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </FormGroup>
                        {errorMessages.monthlyLimit && (
                            <div className={"text-danger"}>{errorMessages.monthlyLimit}</div>
                        )}
                        <FormGroup className="form-group">
                            <Label for="reservedBalance">Reserved balance</Label>
                            <Input
                                id="reservedBalance"
                                type="text"
                                placeholder="Enter your reserved balance"
                                name="reservedBalance"
                                value={formData.reservedBalance}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </FormGroup>
                        {errorMessages.reservedBalance && (
                            <div className={"text-danger"}>{errorMessages.reservedBalance}</div>
                        )}



                        <Button type="submit" className="btn-modern">
                            Create
                        </Button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        {success && <div className="alert alert-success mt-3">{success}</div>}
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default BankAccCreationForm;