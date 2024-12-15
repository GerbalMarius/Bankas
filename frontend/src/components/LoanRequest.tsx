import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {BACKEND_PREFIX, User} from "../App";
import {Link, useNavigate} from "react-router-dom";
import {fetchUserRoles} from "../userapi";
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {BankAccount, fetchCurrentBankAccounts} from "../bankapi";
import Select from "react-select";



const LoanRequest = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [roles, setRoles] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        description: "",
        loanAmount: "",
        bankAccountName:"",
        currencyType: "",
        startingAmount: "",
        interestRate: "",
        durationMonths: 0
    })
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [errorMessages, setErrorMessages] = useState<any>([]);
    const navigate = useNavigate();

    const currencyOptions = ["USD", "EUR", "GBP", "PLN", "JPY"]


    useEffect(() => {
        const contr = new AbortController();
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>(
                    `${BACKEND_PREFIX}/api/user/current`,
                    { signal: contr.signal }
                );
                setUser(response.data);
            } catch (err) {
                if (!contr.signal.aborted) {
                    setUser(null);
                    navigate("/login");
                }
            }
            const roles = await fetchUserRoles();
            if (roles === null) {
                setUser(null);
                navigate("/login");
            } else {
                setRoles(roles);
                if (roles.find(role => role === "USER") === undefined) {
                    setUser(null);
                    navigate("/login"); // adjust for other roles if necessary
                }
            }
        };
        const fetchAccounts =  async () => {
            try {
                const data = await fetchCurrentBankAccounts();
                if (data !== null) {
                    setAccounts(data);
                    setIsLoading(false);
                }

            } catch (err) {
                setError("Failed to load bank accounts");
                setIsLoading(false);
            }
        }


        fetchUser();
        fetchAccounts();
        return () => contr.abort(); // Cleanup on unmount
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                `${BACKEND_PREFIX}/api/loan/new`,
                formData,
                {withCredentials: true}
            )
            if (response.status == 201){
                setSuccess("Loan request created successfully!");
                setError("");
                setFormData({
                    description: "",
                    loanAmount: "",
                    bankAccountName:"",
                    currencyType: "",
                    startingAmount: "",
                    interestRate: "",
                    durationMonths: 0
                })
                setErrorMessages([])
            }
        }catch (err){
            if (err instanceof AxiosError) {
                if (err.response?.status === 400) {
                    setErrorMessages(err.response.data);
                } else {
                    setError("Could not create loan request.");
                }
            }else {
                setError("An unexpected error occurred.");
            }
        }
    }
    if (isLoading){
        return <div>Loading...</div>
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md = {6}>
                    <Link to={"/current"} className={"btn-top-left"}>Back to general</Link>
                    <h2>Loan request for {user?.name}</h2>
                    <Form className={"modern-form"} onSubmit={handleSubmit}>
                        <FormGroup className={"form-group"}>
                            <Label for={"description"}>Description</Label>
                            <Input
                                id={"description"}
                                type={"text"}
                                placeholder={"Enter a description"}
                                onChange={handleChange}
                                name={"description"}
                                value={formData.description}
                            />
                        </FormGroup>
                        {errorMessages.description && (
                            <div className={"text-danger"}>{errorMessages.description}</div>
                        )}
                        <FormGroup className={"form-group"}>
                            <Label for={"loanAmount"}>Loan amount</Label>
                            <Input
                                id={"loanAmount"}
                                name={"loanAmount"}
                                value={formData.loanAmount}
                                onChange={handleChange}
                                type={"text"}
                                placeholder={"Enter a loan amount"}
                            />
                        </FormGroup>
                        {errorMessages.loanAmount && (
                            <div className={"text-danger"}>{errorMessages.loanAmount}</div>
                        )}
                        <FormGroup className="form-group">
                        <Label for="bankAccountName">Select account</Label>
                        <Select
                            id="bankAccountName"
                            name="bankAccountName"
                            value={{ value: formData.bankAccountName, label: formData.bankAccountName }}
                            onChange={(selectedOption) =>
                                setFormData({
                                    ...formData,
                                    bankAccountName: selectedOption?.value || "",
                                })
                            }
                            options={accounts.map((option) => ({
                                value: option.accountName,
                                label: option.accountName,
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
                        {errorMessages.bankAccountName && (
                            <div className={"text-danger"}>{errorMessages.bankAccountName}</div>
                        )}
                    </FormGroup>

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
                        <FormGroup className={"form-group"}>
                            <Label for={"startingAmount"}>Starting amount</Label>
                            <Input
                                id={"startingAmount"}
                                type={"text"}
                                placeholder={"Enter a starting amount"}
                                onChange={handleChange}
                                name={"startingAmount"}
                                value={formData.startingAmount}
                            />
                        </FormGroup>
                        {errorMessages.startingAmount && (
                            <div className={"text-danger"}>{errorMessages.startingAmount}</div>
                        )}
                        <FormGroup className={"form-group"}>
                            <Label for={"interestRate"}>Interest rate</Label>
                            <Input
                                id={"interestRate"}
                                name={"interestRate"}
                                value={formData.interestRate}
                                onChange={handleChange}
                                type={"text"}
                                placeholder={"Enter an interest rate"}
                            />
                        </FormGroup>
                        {errorMessages.interestRate && (
                            <div className={"text-danger"}>{errorMessages.interestRate}</div>
                        )}
                        <FormGroup className={"form-group"}>
                            <Label for={"durationMonths"}>Duration (months)</Label>
                            <Input
                                id={"durationMonths"}
                                name={"durationMonths"}
                                value={formData.durationMonths}
                                onChange={handleChange}
                                type={"text"}
                                placeholder={"Enter a duration in months"}
                            />
                        </FormGroup>
                        {errorMessages.durationMonths && (
                            <div className={"text-danger"}>{errorMessages.durationMonths}</div>
                        )}
                        <Button type="submit" className="btn-modern">
                            Create loan request
                        </Button>
                    </Form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </Col>
            </Row>
        </Container>
    );
}
export default LoanRequest;