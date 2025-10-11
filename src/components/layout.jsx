import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";

export default function Layout({children}){
    return (
        <>
            <Navbar />
            <div className="app-container">
                <div className="page-layout">
                    <Sidebar />
                    <main className="content">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
