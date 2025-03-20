// src/components/ConnectSpotify.tsx
import React from 'react';

interface ConnectSpotifyProps {
    appJwt: string;
    onConnected: () => void;
}

export default function ConnectSpotify({ appJwt, onConnected }: ConnectSpotifyProps) {
    const handleConnect = () => {
        // Use the absolute URL to your backend's Spotify login endpoint.
        window.location.href = `https://abanham.csse.dev/auth/spotify/login?app_jwt=${encodeURIComponent(appJwt)}`;
    };

    return (
        <div className="text-center">
            <button
                onClick={handleConnect}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-700 dark:to-teal-700 text-white font-bold rounded-full hover:from-green-600 hover:to-teal-600 transition"
            >
                Connect your Spotify Account
            </button>
        </div>
    );
}
