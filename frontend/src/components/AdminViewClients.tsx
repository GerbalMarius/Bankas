import React, { useState, useEffect, useCallback  } from 'react';
import axios from 'axios';
import { BACKEND_PREFIX } from '../App';
import { useNavigate } from 'react-router-dom';
import '../adminViewClients.css'; // We'll create this CSS file later

interface Client {
    pinNumber: string;
    name: string;
    address: string;
}

const AdminViewClients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const fetchClients = useCallback(async () => {
        try {
            const response = await axios.get(`${BACKEND_PREFIX}/api/admin/clients`, {
                withCredentials: true
            });
            setClients(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 403) {
                setError('Access denied. Admin rights required.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError('An error occurred while fetching clients.');
            }
        }
    }, [navigate]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleEdit = (pinNumber: string) => {
        // Implement edit functionality
        console.log(`Edit client with PIN: ${pinNumber}`);
    };

    const handleView = (pinNumber: string) => {
        // Implement view functionality
        console.log(`View client with PIN: ${pinNumber}`);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="admin-view-clients">
            <h1>All Clients</h1>
            {clients.map((client) => (
                <div key={client.pinNumber} className="client-card">
                    <h2>{client.name}</h2>
                    <h3>{client.address}</h3>
                    <div className="button-group">
                        <button onClick={() => handleEdit(client.pinNumber)}>Edit</button>
                        <button onClick={() => handleView(client.pinNumber)}>View</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminViewClients;