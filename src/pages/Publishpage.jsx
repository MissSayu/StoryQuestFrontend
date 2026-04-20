import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import ProfileSidebar from "../components/sidemenu.jsx";
import Button from "../components/button.jsx";
import GenreDropdown from "../components/genredropdown.jsx";
import "../styles/publish.css";
import PickStoryDropdown from "../components/pickstorydropdown";
import api from "../../src/api";

export default function PublishPage({ user: initialUser, logout, isMod }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(
        typeof initialUser === "object" ? initialUser : null
    );

    const [mode, setMode] = useState("newStory");
    const [type, setType] = useState("story");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [storyContent, setStoryContent] = useState("");
    const [newEpisodeContent, setNewEpisodeContent] = useState("");
    const [genre, setGenre] = useState("");
    const [cover, setCover] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [file, setFile] = useState(null);

    const [userStories, setUserStories] = useState([]);
    const [selectedStoryId, setSelectedStoryId] = useState("");

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [redirectPath, setRedirectPath] = useState("");

    useEffect(() => {
        if (user || !initialUser || typeof initialUser === "object") return;

        const fetchUserData = async () => {
            try {
                const { data } = await api.get(`/users/username/${initialUser}`);
                setUser(data);
            } catch {
                setPopupMessage("Gebruiker kon niet worden geladen.");
                setRedirectPath("");
                setPopupOpen(true);
            }
        };

        fetchUserData();
    }, [initialUser, user]);

    useEffect(() => {
        if (!user) return;

        const fetchStories = async () => {
            try {
                const { data } = await api.get(`/stories/user/${user.id}`);
                setUserStories(data);
            } catch {
                setPopupMessage("Verhalen konden niet worden geladen.");
                setRedirectPath("");
                setPopupOpen(true);
            }
        };

        fetchStories();
    }, [user]);

    useEffect(() => {
        if (!cover) {
            setCoverPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(cover);
        setCoverPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [cover]);

    const handleCoverUpload = (e) => {
        if (e.target.files[0]) setCover(e.target.files[0]);
    };

    const handleFileUpload = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
        if (redirectPath) {
            navigate(redirectPath);
        }
    };

    const saveStory = async (status) => {
        if (!user) {
            setPopupMessage("User data not loaded yet!");
            setPopupOpen(true);
            return;
        }

        if (
            !title ||
            (type === "story" &&
                !storyContent &&
                mode === "newStory" &&
                status === "published") ||
            (type === "comic" && !file && status === "published")
        ) {
            setPopupMessage(
                status === "draft"
                    ? "Vul minimaal titel in voor draft!"
                    : "Vul alle verplichte velden in!"
            );
            setPopupOpen(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description || "");
            formData.append("genre", genre || "");
            formData.append("type", type);
            formData.append("userId", user.id);
            formData.append("status", status);

            if (mode === "newStory" && type === "story") {
                formData.append("storyContent", storyContent || "");
            }

            if (mode === "newEpisode" && type === "story") {
                formData.append("storyId", selectedStoryId);
                formData.append("storyContent", newEpisodeContent || "");
            }

            if (cover) {
                formData.append("coverImage", cover);
            }

            const { data: savedStoryOrEpisode } = await api.post(
                "/stories/create",
                formData
            );

            if (type === "comic" && file) {
                const comicForm = new FormData();
                comicForm.append("file", file);

                await api.post(
                    `/episodes/${savedStoryOrEpisode.id}/uploadComic`,
                    comicForm
                );
            }

            const storyId =
                mode === "newStory" ? savedStoryOrEpisode.id : selectedStoryId;

            setTitle("");
            setDescription("");
            setStoryContent("");
            setNewEpisodeContent("");
            setGenre("");
            setCover(null);
            setFile(null);
            setSelectedStoryId("");

            setPopupMessage(
                status === "draft"
                    ? "Opgeslagen als draft!"
                    : "Verhaal/comic gepubliceerd!"
            );
            setRedirectPath(`/read/${storyId}`);
            setPopupOpen(true);

        } catch (err) {
            setPopupMessage(
                "Er is iets misgegaan bij opslaan: " +
                (err.response?.data || err.message)
            );
            setRedirectPath("");
            setPopupOpen(true);
        }
    };

    const handlePublish = () => saveStory("published");
    const handleSaveDraft = () => saveStory("draft");

    if (!user) return <p>Loading user...</p>;

    return (
        <>
            <header className="header-user">
                <div className="header-left">
                    <Logo />
                </div>
                <div className="header-center">
                    <Navbar />
                </div>
                <div className="header-right">
                    <AvatarMenu user={user} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="publish-page">
                <ProfileSidebar user={user} />

                <main className="publish-main">
                    <section className="publish-section">
                        <h2>
                            {mode === "newStory"
                                ? `Publiceer een nieuw ${type === "story" ? "verhaal" : "comic"}`
                                : "Nieuw Hoofdstuk"}
                        </h2>

                        <div className="row type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="newStory"
                                    checked={mode === "newStory"}
                                    onChange={() => setMode("newStory")}
                                /> Nieuw verhaal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="newEpisode"
                                    checked={mode === "newEpisode"}
                                    onChange={() => setMode("newEpisode")}
                                /> Nieuw hoofdstuk
                            </label>
                        </div>

                        <div className="row type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="story"
                                    checked={type === "story"}
                                    onChange={() => setType("story")}
                                /> Verhaal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="comic"
                                    checked={type === "comic"}
                                    onChange={() => setType("comic")}
                                /> Comic
                            </label>
                        </div>

                        <div className="row title-genre">
                            <input
                                type="text"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="dropdown-wrapper">
                                {mode === "newStory" ? (
                                    <GenreDropdown
                                        selectedGenre={genre}
                                        setSelectedGenre={setGenre}
                                        options={[
                                            "Fantasy", "Romance", "Sci-Fi", "Mystery",
                                            "Horror", "Western", "Adventure", "Crime",
                                            "Spy", "Thriller",
                                        ]}
                                    />
                                ) : (
                                    <PickStoryDropdown
                                        options={userStories}
                                        selectedStoryId={selectedStoryId}
                                        setSelectedStoryId={setSelectedStoryId}
                                    />
                                )}
                            </div>
                        </div>

                        {mode === "newStory" && (
                            <textarea
                                className="story-textarea description-textarea"
                                placeholder="Korte beschrijving..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        )}

                        {type === "story" &&
                            ((mode === "newStory" && (
                                    <textarea
                                        className="story-textarea content-textarea"
                                        placeholder="Schrijf hier het eerste hoofdstuk..."
                                        value={storyContent}
                                        onChange={(e) => setStoryContent(e.target.value)}
                                    />
                                )) ||
                                (mode === "newEpisode" && (
                                    <textarea
                                        className="story-textarea content-textarea"
                                        placeholder="Nieuw hoofdstuk..."
                                        value={newEpisodeContent}
                                        onChange={(e) => setNewEpisodeContent(e.target.value)}
                                    />
                                )))}

                        <div className="story-actions-column">
                            {type === "comic" && (
                                <div className="comic-upload">
                                    <input
                                        id="comicUpload"
                                        type="file"
                                        accept=".pdf,.cbz,.cbr,.png,.jpg"
                                        onChange={handleFileUpload}
                                    />
                                    <Button asLabel htmlFor="comicUpload">
                                        Upload Comic File
                                    </Button>
                                    {file && <span>{file.name}</span>}
                                </div>
                            )}

                            <input
                                id="coverUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                            />
                            <Button asLabel htmlFor="coverUpload">
                                Upload Cover
                            </Button>

                            {coverPreview && (
                                <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="cover-preview-large"
                                />
                            )}

                            <Button onClick={handlePublish}>
                                Publiceren
                            </Button>
                            <Button onClick={handleSaveDraft}>
                                Opslaan als draft
                            </Button>
                        </div>
                    </section>
                </main>
            </div>

            {popupOpen && (
                <div className="custom-popup-overlay">
                    <div className="custom-popup">
                        <h3>Melding</h3>
                        <p>{popupMessage}</p>
                        <button onClick={handlePopupClose}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}