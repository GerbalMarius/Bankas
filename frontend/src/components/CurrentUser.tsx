import React, {useEffect, useState} from 'react'
import {BACKEND_PREFIX, User} from '../App'
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "reactstrap";
import {fetchUserRoles} from "../userapi";

const CurrentUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [roles, setRoles] = useState<string[]>([])


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
            <Link to={"/"} className={"btn-top-left"} style={{position:"relative", left:"0px"}}>Back to main page</Link>
            <Link to={"/current/accounts"} className={"btn-top-left"} style={{position:"relative", left:"50px"}}>View Bank accounts</Link>
            <Link to={"/current/transferInit"} className={"btn-top-left"}
                  style={{position:"relative",fontWeight:"bolder", left:"500px", top:"220px", padding:"30px", fontSize:"large"}}>
                Transfer money
            </Link>
            <Link to={"/current/accounts/add"} className={"btn-top-left"} style={{position:"relative", left:"50px"}}>Add funds</Link>
            <Button className={"btn-normal"} onClick={handleLogout} style={{position:"absolute", right:"10px"}}>Logout</Button>
            <h1 className={"text-center"}>Hello {user.name}!</h1>
            <h2 className={"text-center"}>Email: {user.email}</h2>
            <h2 className={"text-center"}>Address: {user.address}</h2>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    ) : null;
}
export default CurrentUser;