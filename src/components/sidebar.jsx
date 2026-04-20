import React from "react";
import avatar from "../assets/avatar-placeholder.png";

export default function Sidebar(){
    return (
        <aside className="sidebar">
            <div className="profile-card">
                <img src={avatar} className="avatar" alt="Avatar" />
                <div className="profile-meta">
                    <h3>VireLight</h3>
                    <p>Aspiring writer and storyteller</p>
                </div>
            </div>

            <div style={{marginTop:14}}>
                <div style={{display:"flex",gap:10,marginTop:8}}>
                    <div style={{background:"var(--card-bg)",padding:8,borderRadius:10,textAlign:"center",minWidth:80}}>
                        <strong>6</strong><div style={{fontSize:12,color:"var(--muted)"}}>verhalen</div>
                    </div>
                    <div style={{background:"var(--card-bg)",padding:8,borderRadius:10,textAlign:"center",minWidth:80}}>
                        <strong>0</strong><div style={{fontSize:12,color:"var(--muted)"}}>volgers</div>
                    </div>
                </div>
            </div>

            <div className="menu" style={{marginTop:18}}>
                <button>Dashboard</button>
                <button>Profiel gegevens</button>
                <button>Instellingen</button>
            </div>
        </aside>
    );
}
