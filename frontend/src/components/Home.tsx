import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Link} from "react-router-dom";
import {BACKEND_PREFIX, User} from "../App";
import axios from "axios";


const Home = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check if the user is logged in (e.g., fetch current user)
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>(`${BACKEND_PREFIX}/api/user/current`, {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (err) {
                setUser(null); // No user logged in
            }
        };
        fetchUser();
    }, []);
    return (
        <>
            <h1>Bankas</h1>
            <div className={"btn-container"}>
                {user ? (
                    // Show "Account" link if user is logged in
                    <Link to="/current" className={"login-btn"}>
                        Account
                    </Link>
                ) : (
                    // Show "Login" and "Register" links if no user is logged in
                    <>
                        <Link to="/login" className={"login-btn"}>
                            Login
                        </Link>
                        <br/>
                        <Link to="/register" className={"login-btn"}>
                            Register
                        </Link>
                    </>
                )}
            </div>
            <h2>This is the main page that should display general info about the app</h2>
        </>
    );
}
export default Home;