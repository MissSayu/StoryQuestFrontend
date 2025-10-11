import React from "react";
import "../styles/index.css";
import logo from "../assets/logo.png";
import book1 from "../assets/book-cover-placeholder.png";
import book2 from "../assets/book-cover-placeholder.png";
import book3 from "../assets/book-cover-placeholder.png";

function Homepage() {
    return (
        <div className="fullscreen-bg">
            <div className="homepage">
                <header>
                    <img src={logo} alt="StoryQuest Logo" className="logo" />
                    <nav>
                        <button>Log in</button>
                        <button>Registreren</button>
                    </nav>
                </header>

                <main>
                    <section className="intro">
                        <div className="intro-content">

                            <div className="intro-text">
                                <h1>Start je avontuur in de wereld van verhalen en webcomics.</h1>
                                <p>
                                    Bij StoryQuest kan jij jouw creatieve universum bouwen en delen met de wereld.
                                </p>
                                <button className="cta-btn">Begin nu met schrijven</button>
                            </div>


                            <div className="intro-books">
                                <h2>Populaire verhalen</h2>
                                <div className="book-list">
                                    <img src={book1} alt="Boek 1" className="book" />
                                    <img src={book2} alt="Boek 2" className="book" />
                                    <img src={book3} alt="Boek 3" className="book" />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Homepage;
