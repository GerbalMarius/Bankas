import React, { useEffect, useState } from 'react';
import {fetchTransferHistory, TransferHistory, Transaction, BankAccount} from '../bankapi';
import {BACKEND_PREFIX, User} from "../App";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {fetchUserRoles} from "../userapi"; // Import the CSS file for table styling

const TransferHistoryPage = () => {
    const [transferHistories, setTransferHistories] = useState<TransferHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

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

        const getTransferHistories = async () => {
            try {
                const data = await fetchTransferHistory();
                console.log(data);
                console.log(typeof data);
                if (data){
                    console.log(typeof data);
                    console.log(data);
                    setTransferHistories(data);
                }else {
                    setError('Failed to load transfer history.');
                    setTransferHistories([])
                }
            } catch (err) {
                setError('Failed to load transfer history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };


        fetchUser();
        getTransferHistories();
    }, [navigate]);

    if (loading) return <p>Loading transfer history...</p>;
    if (error) return <p>{error}</p>;
    if (!transferHistories || transferHistories.length === 0)
        return <p>No transfer history available for your accounts.</p>;


    return (
        <div className="transfer-history">
            <h1>Made transactions</h1>
            {transferHistories.map((history, id)  => (
                <div key={id} className="account-transfer-history">
                    <h3 className={"text-center"}>Account Number: {history.bankAccountFrom}</h3>
                    {history.transactions.length > 0 ? (
                        <div className="modern-table-container">
                            <h4 className="modern-table-header">Transactions</h4>
                            <table className="modern-table">
                                <thead>
                                <tr>
                                    <th>From Account</th>
                                    <th>To Account</th>
                                    <th>Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {history.transactions.map((transaction: Transaction) => (
                                    <tr key={transaction.bankAccountFrom}>
                                        <td>{transaction.bankAccountFrom}</td>
                                        <td>{transaction.accountNumberTo}</td>
                                        <td>{transaction.amount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <h2>No transactions made from this account.</h2>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TransferHistoryPage;