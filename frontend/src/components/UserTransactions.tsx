import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_PREFIX } from '../App';
import './UserTransactions.css';

interface Transaction {
  id: number;
  description: string;
  amount: string;
  date: string;
}

interface User {
  email: string;
  name: string;
}

const UserTransactions: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_PREFIX}/api/worker/users`, { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error fetching users.' });
    }
  };

  const fetchTransactions = async (userEmail: string) => {
    try {
      const response = await axios.get(`${BACKEND_PREFIX}/api/worker/transactions/${userEmail}`, { withCredentials: true });
      setTransactions(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error fetching transactions.' });
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userEmail = event.target.value;
    setSelectedUser(userEmail);
    if (userEmail) {
      fetchTransactions(userEmail);
    } else {
      setTransactions([]); // Clear transactions if no user is selected
    }
  };

  const handleCancelTransaction = async (transactionId: number) => {
    try {
      await axios.post(`${BACKEND_PREFIX}/api/worker/cancel-transaction/${transactionId}`, {}, { withCredentials: true });
      setAlert({ type: 'success', message: 'Transaction cancelled successfully.' });
      fetchTransactions(selectedUser); // Refresh transactions
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error cancelling transaction.' });
    }
  };

  return (
    <div className="user-transactions">
      <h1>User Transactions</h1>
      <select value={selectedUser} onChange={handleUserChange}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.email} value={user.email}>
            {user.name}
          </option>
        ))}
      </select>
      {selectedUser && (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <button onClick={() => handleCancelTransaction(transaction.id)}>Cancel Transaction</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
    </div>
  );
};

export default UserTransactions;