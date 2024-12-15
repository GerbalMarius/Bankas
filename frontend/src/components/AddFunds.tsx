import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Col, Container, Row, Form, FormGroup, Label, Button, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BACKEND_PREFIX, User } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { BankAccount, fetchCurrentBankAccounts } from "../bankapi";
import { fetchUserRoles } from "../userapi";
import Select from "react-select";
import StripePayment from "./StripePayment";
import "../stripePayment.css";

const AddFunds = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [errors, setErrors] = useState<any>([]);
    const [success, setSuccess] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<any>(null);
    const [selectedAccount, setSelectedAccount] = useState<string>("");

    useEffect(() => {
        const contr = new AbortController();
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>(
                    `${BACKEND_PREFIX}/api/user/current`,
                    { signal: contr.signal }
                )
                setUser(response.data)
            } catch (err) {
                if (!contr.signal.aborted) {
                    setUser(null);
                    navigate("/login");
                }
            }
        }
        const fetchAccounts = async () => {
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
            const roles = await fetchUserRoles();
            if (roles === null) {
                setUser(null);
                navigate("/login");
            } else {
                setRoles(roles);
                if (roles.find(role => role === "USER") === undefined) {
                    setUser(null);
                    navigate("/login");
                }
            }
        }

        fetchAccounts();
        fetchUser();
    }, []);

    const handleChange = (selectedOption: any) => {
        setSelectedAccount(selectedOption.value);
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Link to={"/current"} className={"btn-top-left"}>Back to general page</Link>
                    <h2>Add funds to your account</h2>
                    <Form className={"modern-form"}>
                        <FormGroup className="form-group">
                            <Label for="accountNumberTo">Select account</Label>
                            <Select
                                id="accountNumberTo"
                                name="accountNumberTo"
                                value={{ value: selectedAccount, label: selectedAccount }}
                                onChange={handleChange}
                                options={accounts.map((option) => ({
                                    value: option.accountName,
                                    label: option.accountName,
                                }))}
                                className="modern-select"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderRadius: "0.25rem",
                                        borderColor: "#ced4da",
                                        height: "calc(1.5em + 0.75rem + 2px)",
                                        fontSize: "1rem",
                                        boxShadow: "none",
                                        "&:hover": {
                                            borderColor: "#80bdff",
                                        },
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 1050,
                                    }),
                                }}
                            />
                        </FormGroup>
                    </Form>
                    {selectedAccount && <StripePayment bankAccountNumber={selectedAccount} />}
                </Col>
            </Row>
        </Container>
    )
}

export default AddFunds;