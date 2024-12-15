import React, {useEffect, useState} from 'react';
import {BankAccount, fetchCurrentBankAccounts} from "../bankapi";
import {Container, Table} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {BACKEND_PREFIX, User} from "../App";
import {fetchUserRoles} from "../userapi";


const BankAccounts = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const navigate = useNavigate();

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
    }, [])
    if (isLoading){
        return <div>Loading...</div>
    }
    if (error){
        return <div>{error}</div>
    }
    return (
        <Container className={"modern-table-container mt-5"}>
            <Link to={"/current"} className={"btn-top-left"} style={{position:"relative", left:"50px"}}>Back to general page</Link>
            <h1 className={"modern-table-header"}>Your Bank Accounts</h1>
            {accounts.length > 0 ? (
                <Table className={"modern-table"}>
                    <thead>
                    <tr>
                        <th>Account number</th>
                        <th>Balance</th>
                        <th>Reserved Balance</th>
                        <th>Daily Limit</th>
                        <th>Monthly Limit</th>
                        <th>Currency</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td>{account.accountName}</td>
                            <td>{account.balance}</td>
                            <td>{account.reservedBalance || "0"}</td>
                            <td>{account.dailyLimit}</td>
                            <td>{account.monthlyLimit}</td>
                            <td>{account.currencyType}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : (
                <div>No accounts found.</div>
            )}
        </Container>
    );
};

export default BankAccounts;