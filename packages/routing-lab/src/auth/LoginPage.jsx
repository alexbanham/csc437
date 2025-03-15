import React from "react";
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../sendPostRequest";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage({ onLoginSuccess }) {
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const response = await sendPostRequest("/auth/login", data);
            if (response.status === 200) {
                const result = await response.json();
                // In LoginPage.jsx, after a successful login:
                const token = result.token;
                console.log("Received token:", token);
                onLoginSuccess(token);
                navigate("/");
                return { type: "success", message: "Login successful" };
            } else if (response.status === 400) {
                const errorData = await response.json();
                return { type: "error", message: errorData.message || "Bad request" };
            } else if (response.status === 401) {
                return { type: "error", message: "Incorrect username or password" };
            } else {
                return { type: "error", message: "Server error, please try again later" };
            }
        } catch (error) {
            console.error(error);
            return { type: "error", message: "Network error, please try again." };
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <UsernamePasswordForm onSubmit={handleLogin} />
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}
