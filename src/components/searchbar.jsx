import React, { useState, useEffect, useRef } from "react";
import searchIcon from "../assets/search-icon.png";
import "./searchbar.css";
import { useNavigate } from "react-router-dom";
import api from "../../src/api";

export default function SearchBar({ placeholder = "Zoeken..." }) {
    const [q, setQ] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        async function fetchSuggestions() {
            if (!q.trim()) {
                setSuggestions([]);
                setShowDropdown(false);
                return;
            }

            try {
                const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
                const data = res.data || {};

                const stories = Array.isArray(data.stories)
                    ? data.stories
                    : Array.isArray(data.storyResults)
                        ? data.storyResults
                        : [];

                const users = Array.isArray(data.users)
                    ? data.users
                    : Array.isArray(data.userResults)
                        ? data.userResults
                        : [];

                const episodes = Array.isArray(data.episodes)
                    ? data.episodes
                    : Array.isArray(data.episodeResults)
                        ? data.episodeResults
                        : [];

                const combined = [...stories, ...episodes, ...users];

                setSuggestions(combined.slice(0, 5));
                setShowDropdown(combined.length > 0);
            } catch (err) {
                console.error("Fout bij ophalen zoeksuggesties:", err);
                setSuggestions([]);
                setShowDropdown(false);
            }
        }

        fetchSuggestions();
    }, [q]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!q.trim()) return;

        navigate(`/search?q=${encodeURIComponent(q)}`);
        setShowDropdown(false);
    };

    const handleClickSuggestion = (text) => {
        setQ(text);
        navigate(`/search?q=${encodeURIComponent(text)}`);
        setShowDropdown(false);
    };

    return (
        <div className="searchbar-wrapper" ref={ref}>
            <form className="searchbar" onSubmit={handleSubmit}>
                <img src={searchIcon} alt="Zoek" className="search-icon" />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search input"
                />
            </form>

            {showDropdown && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="suggestion-item"
                            onClick={() => handleClickSuggestion(item.title || item.username || "")}
                        >
                            {item.title || item.username}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
