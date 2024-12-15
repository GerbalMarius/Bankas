import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_PREFIX } from '../App';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Container, Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import '../adminTransactionStats.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminTransactionStats = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (startDate && endDate) {
            fetchStats();
        }
    }, [startDate, endDate]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_PREFIX}/api/admin/statistics/transactions`,
                {
                    params: { startDate, endDate },
                    withCredentials: true
                }
            );
            setStats(response.data);
        } catch (err) {
            setError('Failed to fetch statistics');
        }
    };

    const chartData = {
        labels: stats?.dailyTotals ? Object.keys(stats.dailyTotals) : [],
        datasets: [
            {
                label: 'Daily Transaction Totals',
                data: stats?.dailyTotals ? Object.values(stats.dailyTotals) : [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <Container className="transaction-stats-container">
            <h1>Transaction Statistics</h1>
            
            <Row className="date-filters mb-4">
                <Col md={6}>
                    <FormGroup>
                        <Label for="startDate">Start Date</Label>
                        <Input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="endDate">End Date</Label>
                        <Input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            {stats && (
                <>
                    <Row className="stats-summary mb-4">
                        <Col md={6}>
                            <div className="stat-card">
                                <h3>Minimum Transaction</h3>
                                <p>{stats.minAmount}</p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="stat-card">
                                <h3>Maximum Transaction</h3>
                                <p>{stats.maxAmount}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="chart-container mb-4">
                        <Col>
                            <Line data={chartData} />
                        </Col>
                    </Row>

                    <Row className="tables-section">
                        <Col md={6}>
                            <h3>Top 5 Accounts</h3>
                            <Table className="stats-table">
                                <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.topAccounts.map((account: any, index: number) => (
                                        <tr key={index}>
                                            <td>{account.accountName}</td>
                                            <td>{account.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h3>Top 5 Transactions</h3>
                            <Table className="stats-table">
                                <thead>
                                    <tr>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.topTransactions.map((transaction: any, index: number) => (
                                        <tr key={index}>
                                            <td>{transaction.from}</td>
                                            <td>{transaction.to}</td>
                                            <td>{transaction.amount}</td>
                                            <td>{transaction.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
            )}

            {error && <div className="error-message">{error}</div>}
        </Container>
    );
};

export default AdminTransactionStats;