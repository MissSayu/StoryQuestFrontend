import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar.jsx";

function HomepageUser({ user, logout, isMod }) {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);

    function handleSearch(query) {
        console.log("Zoekterm:", query);
    }

    useEffect(() => {
        async function fetchStories() {
            try {
                const res = await fetch("http://localhost:8081/api/stories/random?count=10", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch stories");

                const data = await res.json();

                const publishedStories = data.filter(
                    (story) => story.status === "published"
                );

                const displayedStories = [...publishedStories.slice(0, 3)];

                while (displayedStories.length < 3) {
                    displayedStories.push({
                        id: `placeholder-${displayedStories.length}`,
                        title: "Coming soon",
                        coverImage: null,
                        author: { username: "Onbekend" },
                    });
                }

                setStories(displayedStories);
            } catch (err) {
                console.error("Failed to load stories:", err);

                if (err.response?.status === 401) {
                    logout();
                    navigate("/login");
                }
            }
        }

        fetchStories();
    }, [logout, navigate]);

    return (
        <div className="homepage">
            <header className="header-user">
                <Logo user={user} />
                <Navbar onSearch={handleSearch} />
                <AvatarMenu user={user} logout={logout} isMod={isMod} />
            </header>

            <main>
                <section className="welcome-section">
                    <h1>Welkom terug, {user ? user.username : "..."}</h1>
                    <p>Hier zijn enkele verhalen die we voor jou aanraden:</p>

                    <div className="recommended-books">
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                className="book-card"
                                onClick={() => story.coverImage && navigate(`/read/${story.id}`)}
                                style={{ cursor: story.coverImage ? "pointer" : "default" }}
                            >
                                <img
                                    src={
                                        story.coverImage?.trim()
                                            ? `http://localhost:8081${story.coverImage.replace(
                                                "src/main/resources/static",
                                                ""
                                            )}`
                                            : "http://localhost:8081/uploads/covers/book-cover-placeholder.png"
                                    }
                                    alt={story.title || "Story Cover"}
                                    className="book-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            "http://localhost:8081/uploads/covers/book-cover-placeholder.png";
                                    }}
                                />
                                <p>{story.title}</p>
                                <small>Door {story.author?.username || "Onbekend"}</small>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomepageUser;