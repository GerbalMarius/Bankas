import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {Col, Container, Row, Form, FormGroup, Label, Button, Input} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {BACKEND_PREFIX, User} from "../App";
import {Link, useNavigate} from "react-router-dom";
import {BankAccount, fetchCurrentBankAccounts} from "../bankapi";
import {fetchUserRoles} from "../userapi";
import Select from "react-select";


const AddFunds = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [errors, setErrors] = useState<any>([]);
    const [success, setSuccess] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bankAccountNumber : "",
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
                setIsLoading(false);
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
        e.preventDefault()
        try {
            const response = await axios.post(
                `${BACKEND_PREFIX}/api/accounts/currentUser/update`,
                formData,
                {withCredentials : true}
            )
            if (response.status === 200){
                setSuccess("Funds added successfully!");
                setError("");
                setFormData({
                    bankAccountNumber : "",
                    amount : ""
                })
            }
            else if (response.status === 401){
                setError("You are not authorized to perform this action");
                setSuccess("");
            }else{
            }
        }catch (err){
            if (err instanceof AxiosError) {
                if (err.response?.status === 400 || err.response?.status === 401) {
                    // Handle error message from backend
                    if (err.response.data === "Couldn't find the registered bank account.") {
                        setError("Couldn't find the registered bank account.");
                    } else {
                        // If other backend errors (like validation errors)
                        setErrors(err.response.data);
                    }
                }
            }
            else{
                setError("Failed to add funds due to an unexpected error");
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
                    <h2>Add funds to your account</h2>
                    <Form className={"modern-form"} onSubmit={handleSubmit}>
                        <FormGroup className="form-group">
                            <Label for="accountNumberTo">Select account</Label>
                            <Select
                                id="accountNumberTo"
                                name="accountNumberTo"
                                value={{ value: formData.bankAccountNumber, label: formData.bankAccountNumber }}
                                onChange={(selectedOption) =>
                                    setFormData({
                                        ...formData,
                                        bankAccountNumber: selectedOption?.value || "",
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
                        </FormGroup>
                        {errors.bankAccountNumber && (
                            <div className={"text-danger"}>{errors.bankAccountNumber}</div>
                        )}
                        <FormGroup className="form-group">
                            <Label for="amount">Amount</Label>
                            <Input
                                type="text"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </FormGroup>
                        {errors.amount && (
                            <div className={"text-danger"}>{errors.amount}</div>
                        )}
                        <Button type="submit" className="btn-modern">
                            Add funds
                        </Button>
                    </Form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                </Col>
            </Row>
        </Container>
    )
}
export default AddFunds;