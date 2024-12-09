import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';
import "react-router-dom";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import About from "./components/About";
import NavTabs from "./components/NavTabs";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

export const BACKEND_PREFIX = "http://localhost:8080"

class App extends React.Component {

    render() {
        return (
            <Router>{}
            <header>
                <NavTabs activeTab={window.location.pathname} />{}
            </header>
                <main>
                    <Routes>
                        <Route path={"/home"} element={<Home/>}/>
                        <Route path={"/about"} element={<About/>} />
                        <Route path={"/register"} element={<Register/>}/>
                        <Route path={"/login"} element={<Login/>}/>
                    </Routes>
                </main>
            </Router>
        );
    }
}

export default App;
