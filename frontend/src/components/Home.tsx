import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {Link} from "react-router-dom";


const Home = () => {
    return (
        <>
            <h1>Bankas</h1>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </>
    )
}
export default Home;