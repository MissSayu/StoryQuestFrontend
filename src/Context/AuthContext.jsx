import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // load from storage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // LOGIN
    function login(userData) {
        const fullUser = {
            id: userData.id,
            username: userData.username,
            role: userData.role,
            isMod: userData.isMod || false,
            avatarUrl: userData.avatarUrl || null,
            bio: userData.bio || "",
            token: userData.token, // 🔥 IMPORTANT
        };

        localStorage.setItem("user", JSON.stringify(fullUser));
        localStorage.setItem("token", userData.token); // extra safety

        setUser(fullUser);
    }

    // LOGOUT
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    // UPDATE USER (profile edits)
    function updateUser(updatedData) {
        setUser((prev) => {
            const newUser = { ...prev, ...updatedData };

            localStorage.setItem("user", JSON.stringify(newUser));

            return newUser;
        });
    }

    const value = {
        user,
        isLoggedIn: !!user,
        isMod: user?.isMod || false,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
