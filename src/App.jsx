import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import HomepageGuest from "./pages/HomepageGuest.jsx";
import HomepageUser from "./pages/HomepageUser";
import ModPage from "./pages/Modpage";
import ProfilePage from "./pages/Profilepage.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublishPage from "./pages/Publishpage.jsx";
import ReadPage from "./pages/ReadPage.jsx";
//import SearchResultsPage from "./pages/Seachpage";
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

            {/*<Route path="/search" element={<SearchResultsPage user={user} logout={logout} />}*/}
            {/*/>*/}

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
