import React, { useState, useEffect } from 'react';
import FriendFeed from './components/FriendFeed';
import { FaSun, FaMoon, FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Toggle dark mode and store preference
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Load theme preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') setDarkMode(true);
    }, []);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

            {/* Header */}
            <header className={`p-6 transition shadow-md flex items-center justify-between
  ${darkMode ? 'bg-gradient-to-r from-green-700 to-teal-700 text-white' : 'bg-gradient-to-r from-green-200 to-green-400 text-gray-900'}`}>

                {/* Title & Subtitle - Left aligned on mobile */}
                <div className="text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg">
                        SoundSync
                    </h1>
                    <p className="mt-2 text-lg font-medium opacity-80 hidden sm:block">
                        Connect with friends through music 🎵
                    </p>
                </div>

                {/* Dark Mode Toggle (Doesn't wrap too early) */}
                <div className="ml-auto">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-full transition 
        ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300'}
        w-auto min-w-[40px] sm:min-w-[100px]`}
                    >
                        {darkMode ? '🌙' : '☀️'}
                        <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
                    </button>
                </div>

            </header>


            <FriendFeed darkMode={darkMode}/>
        </div>
    );
}
