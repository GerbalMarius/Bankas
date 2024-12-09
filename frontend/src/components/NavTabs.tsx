import React from "react";
import {Link} from "react-router-dom";

interface Props {
    activeTab: string;
}

class NavTabs extends React.Component<Props> {

    render() {
        const tabs = [
            {name: "Pagrindinis Puslapis", route: "/home"},
            {name: "Apie mus", route: "/about"},
            {name: "Registruotis", route: "/register"},
            {name: "Prisijungti", route: "/login"}
        ];


        return (
            <nav className="navbar navbar-expand-lg">
                <ul className="nav nav-tabs w-100">
                    {tabs.map((tab) => (
                        <li className={"nav-item flex-fill text-center"} key={tab.route}>
                            <Link
                                to={tab.route}
                                className={`nav-link ${this.props.activeTab === tab.route ? "active" : ""}`}
                            >
                                {tab.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}

export default NavTabs;