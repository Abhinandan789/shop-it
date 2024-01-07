//NAVBAR
import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
    return (
        <div className="app-container">
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/cart">Cart</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;