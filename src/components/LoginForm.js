//LOGIN

import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext.js";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");

    const logIn = (e) => {
        e.preventDefault();

        fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    setIsLoggedIn(true);
                    setAuthUser({
                        Name: data.username,
                        Gender: data.gender,
                        src: data.image,
                    });
                    setLoginMessage("Logged In successfully ");
                    navigate("/");
                } else {
                    setIsLoggedIn(false);
                    setAuthUser(null);
                    setLoginMessage("Invalid username or password. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during login:", error);
                setIsLoggedIn(false);
                setAuthUser(null);
                setLoginMessage("An error occurred during login. Please try again.");
            });
    };

    const logOut = (e) => {
        e.preventDefault();
        setIsLoggedIn(false);
        setAuthUser(null);
        setLoginMessage("Logged Out successfully! ");

        setUsername("");
        setPassword("");
    };

    return (
        <>
            <span>User is currently: {isLoggedIn ? "Logged-IN" : "Logged-OFF"}</span>{" "}
            <br />
            {isLoggedIn ? <span>User Name: {authUser?.Name}</span> : null}
            <br />
            {!isLoggedIn && (
                <>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <br />
                    <button onClick={(e) => logIn(e)}>Log In</button>
                </>
            )}
            {isLoggedIn ? <button onClick={(e) => logOut(e)}>Log Out</button> : null}
            <p>
                {loginMessage}
                {authUser?.Name.toUpperCase()}
            </p>
        </>
    );
};

export default LoginForm;