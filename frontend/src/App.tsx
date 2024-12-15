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
import BankAccounts from "./components/BankAccounts";
import BankAccCreationForm from "./components/BankAccCreationForm";
import Transfer from "./components/Transfer";
import AddFunds from "./components/AddFunds";

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
                        <Route path={"/current/accounts"} element={<BankAccounts/>}/>
                        <Route path={"/accounts/create"} element={<BankAccCreationForm/>}/>
                        <Route path={"/current/transferInit"} element={<Transfer/>}/>
                        <Route path={"/current/accounts/add"} element={<AddFunds/>}/>
                    </Routes>
                </main>
                </div>
            </Router>
            </div>

        );
    }
}

export default App;
