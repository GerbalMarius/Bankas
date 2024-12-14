import React, {useEffect, useState} from 'react'
import {BACKEND_PREFIX, User} from '../App'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Button} from "reactstrap";

const CurrentUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');


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
        fetchUser();
        return () => contr.abort();
    }, [navigate]);
    const url = ""

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${BACKEND_PREFIX}/out`,
                url, {withCredentials: true});
            setUser(null);
            if (response.status === 200) {
                navigate("/login?logout");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(err.response.data);
                } else {
                    setError("No response from server. Please try again later.");
                }
            } else {
                console.error(err);
                setError("An unexpected error occurred.");
            }
        }
    };
    return user ? (
        <div>
            <h1>Hello {user.name}</h1>
            <p>Your email is {user.email}</p>
            <Button className={"btn-normal"} onClick={handleLogout} style={{position:"relative"}}>Atsijungti</Button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    ) : null;
}
export default CurrentUser;