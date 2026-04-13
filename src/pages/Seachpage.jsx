import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar.jsx";
import "../styles/searchpage.css";
import api from "../../src/api";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage({ user, logout, isMod, handleSearch }) {
    const query = useQuery().get("q") || "";
    const navigate = useNavigate();

    const [results, setResults] = useState({
        stories: [],
        users: [],
        episodes: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchResults() {
            if (!query.trim()) {
                setResults({ stories: [], users: [], episodes: [] });
                setError("");
                return;
            }

            setLoading(true);
            setError("");

            try {
                const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
                const data = res.data || {};

                // Ondersteun meerdere mogelijke backend shapes
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

                setResults({
                    stories,
                    users,
                    episodes,
                });
            } catch (err) {
                console.error("Fout bij laden van zoekresultaten:", err);
                setResults({ stories: [], users: [], episodes: [] });

                if (err.response?.status === 403) {
                    setError("Je hebt geen toegang tot deze zoekactie.");
                } else if (err.response?.status === 404) {
                    setError("Zoekroute niet gevonden in de backend.");
                } else {
                    setError("Zoekresultaten konden niet geladen worden.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [query]);

    return (
        <div className="search-results-page">
            <header className="header-user">
                <Logo user={user} />
                <Navbar onSearch={handleSearch} />
                <AvatarMenu user={user} logout={logout} isMod={isMod} />
            </header>

            <main className="search-results-main">
                <h2>Resultaten voor: "{query}"</h2>

                {loading && <p>Zoeken...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && results.stories.length > 0 && (
                    <>
                        <h3>Verhalen</h3>
                        <div className="grid stories-grid">
                            {results.stories.map((story) => (
                                <div
                                    key={story.id}
                                    className="book-card"
                                    onClick={() => navigate(`/read/${story.id}`)}
                                >
                                    <img
                                        src={
                                            story.coverImage
                                                ? `http://localhost:8081${story.coverImage.replace("src/main/resources/static", "")}`
                                                : "http://localhost:8081/uploads/default-cover.png"
                                        }
                                        alt={story.title}
                                        className="book-cover"
                                    />
                                    <p>{story.title}</p>
                                    <small>Door {story.author?.username || story.username || "Onbekend"}</small>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loading && !error && results.episodes.length > 0 && (
                    <>
                        <h3>Episodes</h3>
                        <div className="grid episodes-grid">
                            {results.episodes.map((ep) => (
                                <div
                                    key={ep.id}
                                    className="episode-card"
                                    onClick={() => navigate(`/read/${ep.storyId || ep.story?.id}#${ep.id}`)}
                                >
                                    <img
                                        src={
                                            ep.coverUrl
                                                ? `http://localhost:8081${ep.coverUrl}`
                                                : ep.storyCoverImage
                                                    ? `http://localhost:8081${ep.storyCoverImage}`
                                                    : "http://localhost:8081/uploads/default-cover.png"
                                        }
                                        alt={ep.title}
                                        className="episode-cover"
                                    />
                                    <p>{ep.title}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loading && !error && results.users.length > 0 && (
                    <>
                        <h3>Gebruikers</h3>
                        <div className="grid users-grid">
                            {results.users.map((u) => (
                                <div
                                    key={u.id}
                                    className="user-card"
                                    onClick={() => navigate(`/profile/${u.username}`)}
                                >
                                    <img
                                        src={
                                            u.avatarUrl
                                                ? u.avatarUrl.startsWith("http")
                                                    ? u.avatarUrl
                                                    : `http://localhost:8081${u.avatarUrl}`
                                                : "http://localhost:8081/avatars/default.jpg"
                                        }
                                        alt={u.username}
                                        className="user-avatar"
                                    />
                                    <p>{u.username}</p>
                                    <small>{u.bio || "Geen bio beschikbaar"}</small>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loading &&
                    !error &&
                    results.stories.length === 0 &&
                    results.episodes.length === 0 &&
                    results.users.length === 0 && (
                        <p>Geen resultaten gevonden.</p>
                    )}
            </main>
        </div>
    );
}
