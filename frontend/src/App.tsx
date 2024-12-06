import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';
import "react-router-dom";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import About from "./About";
import NavTabs from "./NavTabs";
import Home from "./Home";

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
                    </Routes>
                </main>
            </Router>
        );
    }
}

export default App;
