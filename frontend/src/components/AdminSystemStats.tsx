import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_PREFIX } from '../App';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import '../adminSystemStats.css';

interface SystemStats {
    totalMemory: number;
    freeMemory: number;
    maxMemory: number;
    availableProcessors: number;
    osName: string;
    osVersion: string;
    javaVersion: string;
    uptime: number;
    systemLoad: string;
    threadCount: number;
}

const AdminSystemStats = () => {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${BACKEND_PREFIX}/api/admin/system/stats`, {
                    withCredentials: true
                });
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch system statistics');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (error) return <div className="error-message">{error}</div>;
    if (!stats) return <div>Loading...</div>;

    return (
        <Container className="system-stats-container">
            <h1>System Statistics</h1>
            <Row>
                <Col md={6} lg={4}>
                    <Card className="stat-card memory">
                        <CardBody>
                            <CardTitle>Memory Usage</CardTitle>
                            <CardText>
                                <div>Total: {stats.totalMemory} MB</div>
                                <div>Free: {stats.freeMemory} MB</div>
                                <div>Max: {stats.maxMemory} MB</div>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="stat-card system">
                        <CardBody>
                            <CardTitle>System Info</CardTitle>
                            <CardText>
                                <div>OS: {stats.osName}</div>
                                <div>Version: {stats.osVersion}</div>
                                <div>Java: {stats.javaVersion}</div>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="stat-card performance">
                        <CardBody>
                            <CardTitle>Performance</CardTitle>
                            <CardText>
                                <div>CPU Load: {stats.systemLoad}%</div>
                                <div>Processors: {stats.availableProcessors}</div>
                                <div>Threads: {stats.threadCount}</div>
                                <div>Uptime: {Math.floor(stats.uptime / 60)} minutes</div>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminSystemStats;
