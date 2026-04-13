import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/Context/AuthContext";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import "./avatar.css";

export default function AvatarMenu() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout, isMod } = useAuth();


    if (!user) return null;

    const username = user.username || "Onbekende gebruiker";

    // Avatar fallback
    const profileImg = user.avatarUrl
        ? user.avatarUrl.startsWith("http")
            ? user.avatarUrl
            : `http://localhost:8081${user.avatarUrl}`
        : avatarPlaceholder;

    // Toggle dropdown
    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen((prev) => !prev);
    };

    // Logout en ga naar HomepageGuest
    const handleLogout = (e) => {
        e.stopPropagation();
        logout();
        setDropdownOpen(false);
        navigate("/homepage-guest", { replace: true });
    };

    // Sluit dropdown als je ergens buiten klikt
    const handleClickOutside = () => {
        if (dropdownOpen) setDropdownOpen(false);
    };
    React.useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [dropdownOpen]);

    return (
        <div className="profile" onClick={toggleDropdown}>
            <img
                src={profileImg}
                alt="Profielfoto"
                className="avatar"
                onError={(e) => (e.target.src = avatarPlaceholder)}
            />

            {dropdownOpen && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <Link
                        to={`/profile/${username}`}
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                    >
                        Profiel
                    </Link>

                    <button
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                    >
                        Instellingen
                    </button>

                    {isMod && (
                        <Link
                            to="/mod"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                        >
                            ModPage
                        </Link>
                    )}

                    <button className="dropdown-item" onClick={handleLogout}>
                        Uitloggen
                    </button>
                </div>
            )}
        </div>
    );
}
