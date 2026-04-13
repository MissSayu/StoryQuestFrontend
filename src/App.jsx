import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "../frontend/styles/global.css";
import HomepageGuest from "../frontend/pages/HomepageGuest.jsx";
import HomepageUser from "../frontend/pages/HomepageUser.jsx";
import ModPage from "../frontend/pages/Modpage.jsx";
import ProfilePage from "../frontend/pages/Profilepage.jsx";
import Login from "../frontend/pages/Login.jsx";
import Register from "../frontend/pages/Register.jsx";
import PublishPage from "../frontend/pages/Publishpage.jsx";
import ReadPage from "../frontend/pages/ReadPage.jsx";
import SearchResultsPage from "../frontend/pages/Seachpage";
import { useAuth } from "./Context/AuthContext";

function AppWrapper() {
    const { user, isMod, logout } = useAuth();

    return (
        <Routes>
            <Route path="/"  element={user ? <HomepageUser user={user} logout={logout} isMod={isMod} /> : <HomepageGuest />}
            />
            <Route path="/home"  element={user ? <HomepageUser user={user} logout={logout} isMod={isMod} /> : <HomepageGuest />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {isMod && (
                <Route path="/mod" element={<ModPage user={user} logout={logout} />} />
            )}

            <Route path="/profile/:username" element={<ProfilePage user={user} logout={logout} isMod={isMod} />}
            />

            <Route path="/publiceren" element={<PublishPage user={user} logout={logout} isMod={isMod} />}
            />

            <Route path="/read/:storyId" element={<ReadPage user={user} logout={logout} />}
            />

            <Route path="/search" element={<SearchResultsPage user={user} logout={logout} />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}
