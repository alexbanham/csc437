import React from "react";
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../sendPostRequest";
import { useNavigate } from "react-router-dom";

export function RegisterPage({ onRegisterSuccess }) {
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        try {
            const response = await sendPostRequest("/auth/register", data);
            if (response.status === 201) {
                // Try to parse token from the response (if provided)
                let result = {};
                try {
                    result = await response.json();
                } catch (e) {
                    console.log("No JSON body returned; proceeding with redirect.");
                }
                if (result.token) {
                    onRegisterSuccess(result.token);
                }
                // Redirect to the homepage after successful registration
                navigate("/");
                return { type: "success", message: "Registration successful!" };
            } else if (response.status === 400) {
                const errorData = await response.json();
                return {
                    type: "error",
                    message: errorData.message || "Username already taken"
                };
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
            <h2>Register a New Account</h2>
            <UsernamePasswordForm onSubmit={handleRegister} />
        </div>
    );
}
