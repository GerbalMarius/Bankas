import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';
import  '../src/form-styles.css'
import "react-router-dom";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import About from "./components/About";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import CurrentUser from "./components/CurrentUser";
import WorkerLogin from './components/WorkerLogin';
import WorkerRegister from './components/WorkerRegister';
import WorkerDashboard from './components/WorkerDashboard';
import AdminLogin from "./components/AdminLogin";
import AdminViewClients from './components/AdminViewClients';
import AdminDashboard from './components/AdminDashboard';

export const BACKEND_PREFIX = "http://localhost:8080"

export interface User {
    email: string;
    pinNumber: string;
    name: string;
    address: string;
}
class App extends React.Component {

    render() {
        return (
            <div className={"page-container"}>
            <Router>{}
                <div>
                <main>
                    <Routes>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/about"} element={<About/>} />
                        <Route path={"/register"} element={<Register/>}/>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/current"} element={<CurrentUser/>}/>
                        <Route path={"/worker-login"} element={<WorkerLogin/>}/>
                        <Route path={"/worker-register"} element={<WorkerRegister/>}/>
                        <Route path={"/worker-dashboard"} element={<WorkerDashboard/>}/>
                        <Route path={"/admin-login"} element={<AdminLogin/>}/>
                        <Route path="/admin/viewClients" element={<AdminViewClients/>} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    </Routes>
                </main>
                </div>
            </Router>
            </div>

        );
    }
}

export default App;
