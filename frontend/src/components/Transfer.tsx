import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {Col, Container, Row, Form, FormGroup, Label, Button, Input} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {BACKEND_PREFIX, User} from "../App";
import {Link, useNavigate} from "react-router-dom";
import {BankAccount, fetchCurrentBankAccounts} from "../bankapi";
import {fetchUserRoles} from "../userapi";
import Select from "react-select";


const Transfer = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<any>([]);
    const [success, setSuccess] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        description: "",
        bankAccountFrom : "",
        accountNumberTo : "",
        amount : ""
    })

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
        }
        const fetchAccounts =  async () =>{
            try {
                const data = await fetchCurrentBankAccounts();
                if (data !== null){
                    setAccounts(data);
                    setIsLoading(false);
                }

            }catch (err){
                setError("Failed to load bank accounts");
                setIsLoading(false);
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

        fetchAccounts();
        fetchUser();
    }, []);

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
                `${BACKEND_PREFIX}/api/transactions/commit`,
                formData,
                {withCredentials:true}
            )
            if (response.status === 201){
                setSuccess("Transaction committed successfully!");
                setError("");
                setFormData({
                    description: "",
                    bankAccountFrom : "",
                    accountNumberTo : "",
                    amount : ""
                })
            }else{
                setError("Failed to commit transaction");
            }
        }catch (err){
            if (err instanceof AxiosError) {
                if (err.response?.status === 400) {
                    setErrorMessages(err.response.data);
                } else {
                    setError("Could not commit transaction.");
                }
            } else {
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
                <Col md={6}>
                    <Link to={"/current"} className={"btn-top-left"}>Back to general page</Link>
                    <h2>Transfer money</h2>
                    <Form className={"modern-form"} onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input type="text" name="description" id="description" value={formData.description} onChange={handleChange}/>
                        </FormGroup>
                        {errorMessages.description && (
                            <div className={"text-danger"}>{errorMessages.description}</div>
                        )}

                        <FormGroup className="form-group">
                            <Label for="banckAccountFrom">Select account</Label>
                            <Select
                                id="bankAccountFrom"
                                name="bankAccountFrom"
                                value={{ value: formData.bankAccountFrom, label: formData.bankAccountFrom }}
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        bankAccountFrom: selectedOption?.value || "",
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
                            {errorMessages.bankAccountFrom && (
                                <div className={"text-danger"}>{errorMessages.bankAccountFrom}</div>
                            )}
                        </FormGroup>
                        <FormGroup className={"form-group"}>
                            <Label for="accountNumberTo">Recipient account number</Label>
                            <Input
                                type="text"
                                name="accountNumberTo"
                                id="accountNumberTo"
                                value={formData.accountNumberTo}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        {errorMessages.accountNumberTo && (
                            <div className={"text-danger"}>{errorMessages.accountNumberTo}</div>
                        )}
                        <FormGroup className={"form-group"}>
                            <Label for="amount">Amount</Label>
                            <Input
                                type="text"
                                name="amount"
                                id="amount"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        {errorMessages.amount && (
                            <div className={"text-danger"}>{errorMessages.amount}</div>
                        )}

                        <Button type="submit" className="btn-modern">
                            Transfer money
                        </Button>
                    </Form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </Col>
            </Row>
        </Container>
    )
}
export default Transfer;