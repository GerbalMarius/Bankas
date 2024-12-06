import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';

const About  = () => {
    return (
        <div style={{marginTop: '200px'}} className="container-fluid">
            <h1>About Us</h1>
            <ul>
                <li><h2>Marius Ambrazevičius</h2></li>
                <li><h2>Benas Kubilius</h2></li>
                <li><h2>Dovydas Rakšnys</h2></li>
                <li><h2>Arijus Jašinskas</h2></li>
            </ul>
        </div>
    )
}
export default About;