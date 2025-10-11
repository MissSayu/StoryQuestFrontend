import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import HomepageGuest from "./pages/HomepageGuest.jsx";
import HomepageUser from "./pages/HomepageUser.jsx";
import ModPage from "./pages/Modpage.jsx";
import ProfilePage from "./pages/Profilepage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PublishPage from "./pages/Publishpage.jsx";

function App() {
    const [user, setUser] = useState("Virelight");
    const [isMod, setIsMod] = useState(false);

    function logout() {
        setUser(null);
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={user ? <HomepageUser user={user} logout={logout} /> : <HomepageGuest />}
                />
                <Route
                    path="/home"
                    element={user ? <HomepageUser user={user} logout={logout} /> : <HomepageGuest />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mod" element={<ModPage user={user} logout={logout} />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/publiceren" element={<PublishPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
