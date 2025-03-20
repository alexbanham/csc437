// src/App.tsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Player from './components/Player';
import ProfileView from './components/ProfileView'; // New Profile view component
import ConnectSpotify from './components/ConnectSpotify';
import RecentlyPlayedWidget from './components/RecentlyPlayedWidget';
import RecentPlaylistsWidget from './components/RecentPlaylistsWidget';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [spotifyConnected, setSpotifyConnected] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'player' | 'profile'>('player');

    // Toggle dark mode and store preference.
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Load theme preference.
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') setDarkMode(true);
    }, []);

    // Get token from session storage.
    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) setToken(storedToken);
    }, []);

    // Check if Spotify is connected.
    useEffect(() => {
        const spConnected = localStorage.getItem('spotifyConnected');
        if (spConnected === 'true') {
            setSpotifyConnected(true);
        }
        const params = new URLSearchParams(window.location.search);
        const spConnectedQuery = params.get('spotifyConnected');
        if (spConnectedQuery === 'true') {
            localStorage.setItem('spotifyConnected', 'true');
            setSpotifyConnected(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleLogin = (token: string) => {
        sessionStorage.setItem('token', token);
        setToken(token);
    };

    const handleSignOut = () => {
        sessionStorage.removeItem('token');
        setToken(null);
        localStorage.removeItem('spotifyConnected');
        setSpotifyConnected(false);
    };

    const handleRegisterSuccess = () => {
        setIsRegistering(false);
    };

    if (!token) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-r from-gray-100 to-white text-gray-900'}`}>
                {isRegistering ? (
                    <Register
                        onRegister={handleRegisterSuccess}
                        darkMode={darkMode}
                        onBackToLogin={() => setIsRegistering(false)}
                    />
                ) : (
                    <Login onLogin={handleLogin} onToggleRegister={() => setIsRegistering(true)} darkMode={darkMode} />
                )}
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-white'} text-gray-900 dark:text-white`}>
            {/* Header */}
            <header
                className={`p-6 transition shadow-md flex flex-col sm:flex-row items-center justify-between ${
                    darkMode ? 'bg-gradient-to-r from-green-800 to-teal-800 text-white' : 'bg-gradient-to-r from-green-200 to-green-400 text-gray-900'
                }`}
            >
                <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg">
                        SoundSync
                    </h1>
                    <p className="mt-2 text-lg font-medium opacity-80 hidden sm:block">
                        Connect with friends through music 🎵
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-full transition 
              ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300'}
              w-auto min-w-[40px] sm:min-w-[100px]`}
                    >
                        {darkMode ? <FaMoon /> : <FaSun />}
                        <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 font-medium rounded-full transition bg-red-500 text-white hover:bg-red-400"
                    >
                        <FaSignOutAlt />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Navigation for Player vs. Profile view */}
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    onClick={() => setViewMode('player')}
                    className={`px-6 py-2 rounded font-medium transition ${
                        viewMode === 'player'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                >
                    Player
                </button>
                <button
                    onClick={() => setViewMode('profile')}
                    className={`px-6 py-2 rounded font-medium transition ${
                        viewMode === 'profile'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                >
                    Profile
                </button>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {viewMode === 'player' ? (
                    <>
                        {!spotifyConnected ? (
                            <ConnectSpotify
                                appJwt={token}
                                onConnected={() => {
                                    localStorage.setItem('spotifyConnected', 'true');
                                    setSpotifyConnected(true);
                                }}
                            />
                        ) : (
                            <>
                                <Player />
                                <div className="mt-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    <RecentlyPlayedWidget/>
                                    <RecentPlaylistsWidget/>
                                </div>

                            </>
                        )}
                    </>
                ) : (
                    <ProfileView/>
                )}
            </div>
        </div>
    );
}
