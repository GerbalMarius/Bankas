import React from 'react';
import { Link } from 'react-router-dom';
import '../adminDashboard.css';

interface AdminFeature {
    name: string;
    description: string;
    path: string;
}

const adminFeatures: AdminFeature[] = [
    {
        name: "View Clients",
        description: "List and manage all clients in the system",
        path: "/admin/viewClients"
    },
    {
        name: "Transaction Statistics",
        description: "View detailed transaction analytics",
        path: "/admin/statistics"
    }
];

const AdminDashboard: React.FC = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="feature-grid">
                {adminFeatures.map((feature, index) => (
                    <Link to={feature.path} key={index} className="feature-card">
                        <h2>{feature.name}</h2>
                        <h3>{feature.description}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;