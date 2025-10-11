import React, { useState } from "react";
import "../styles/login.css";
import Logo from "../components/Logo";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("user", JSON.stringify(data));
                setMessage(`Welkom terug, ${data.username}!`);

            } else {
                const error = await response.json();
                setMessage(error.error || "Onjuiste gebruikersnaam of wachtwoord.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Er ging iets mis met de verbinding.");
        }
    };

    return (
        <div className="center-container">
            <Logo />

            <div className="login-box">
                <h1>Log in</h1>

                <label htmlFor="username">Gebruikersnaam:</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Virelight"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="password">Wachtwoord:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <a href="#" className="forgot-password">Wachtwoord vergeten?</a>

                <button className="button" onClick={handleLogin}>Log in</button>

                {message && <p style={{ color: "white" }}>{message}</p>}

                <div className="register-text">
                    <p>Nog geen account?</p>
                    <a href="/register">Registreren</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
