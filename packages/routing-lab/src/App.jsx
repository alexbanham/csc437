import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './auth/LoginPage.jsx';
import { RegisterPage } from './auth/RegisterPage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Homepage } from './Homepage.jsx';
import { ImageGallery } from './images/ImageGallery.jsx';
import { ImageDetails } from './images/ImageDetails.jsx';
import { AccountSettings } from './AccountSettings.jsx';
import { MainLayout } from './MainLayout.jsx';
import { useImageFetching } from './images/useImageFetching.js';
import { jwtDecode } from "jwt-decode";


function App() {
    const [authToken, setAuthToken] = useState(null);
    const [userName, setUserName] = useState("Guest");
    const [isChecked, setIsChecked] = useState(false);

    // Handle login (or registration) success:
    // Set the token and decode it to update the username state.
    const handleLoginSuccess = (token) => {
        setAuthToken(token);
        try {
            const decoded = jwtDecode(token);
            if (decoded.username) {
                setUserName(decoded.username);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    };

    // Clear the auth token and username state (logout)
    const handleLogout = () => {
        setAuthToken(null);
        setUserName("Guest");
    };

    // Pass authToken to the image fetching hook so it can include it in requests.
    const { fetchedImages, isLoading } = useImageFetching(authToken, "");

    return (
        <Routes>
            {/* Public routes for authentication */}
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />

            {/* Protected routes: if not authenticated, ProtectedRoute will redirect to /login */}
            <Route
                path="/"
                element={
                    <ProtectedRoute authToken={authToken}>
                        <MainLayout isChecked={isChecked} setIsChecked={setIsChecked} onLogout={handleLogout} />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Homepage userName={userName} authToken={authToken} />} />
                <Route path="images" element={<ImageGallery fetchedImages={fetchedImages} isLoading={isLoading} />} />
                <Route path="images/:imageId" element={<ImageDetails fetchedImages={fetchedImages} />} />
                <Route path="account" element={<AccountSettings userName={userName} setUserName={setUserName} />} />
            </Route>
        </Routes>
    );
}

export default App;
