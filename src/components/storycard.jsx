import React from "react";
export default function StoryCard({cover, title="Titel", tag="Fantasy"}){
    return (
        <div className="story-card">
            <img src={cover} alt={title}/>
            <div className="meta">
                <h4>{title}</h4>
                <small>{tag}</small>
            </div>
            <div className="card-actions">
                <button>Bewerken</button>
                <button>Bekijken</button>
            </div>
        </div>
    );
}
