// src/components/RecentPlaylistsWidget.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

interface Playlist {
    name: string;
    images: { url: string }[];
    external_urls: { spotify: string };
}

interface PlaylistsData {
    items: Playlist[];
}

export default function RecentPlaylistsWidget() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlaylists = async () => {
        try {
            const response = await api.get<PlaylistsData>('/api/player/playlists');
            if (response.data && response.data.items) {
                setPlaylists(response.data.items);
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
        const intervalId = setInterval(() => {
            fetchPlaylists();
        }, 30000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return (
            <div className="text-center py-6">
                <p className="text-2xl dark:text-white">Loading playlists...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl ring-2 ring-gray-300 dark:ring-gray-700 p-12 rounded-xl h-[36rem] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Playlists</h2>
            {playlists.length === 0 ? (
                <p className="text-center text-xl dark:text-gray-300">No playlists found.</p>
            ) : (
                <ul className="space-y-4">
                    {playlists.map((playlist, index) => {
                        const cover = playlist.images[0]?.url;
                        return (
                            <li
                                key={index}
                                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded transition"
                                onClick={() => window.open(playlist.external_urls.spotify, '_blank')}
                            >
                                {cover && (
                                    <img src={cover} alt={playlist.name} className="w-20 h-20 rounded" />
                                )}
                                <div>
                                    <p className="font-semibold text-xl">{playlist.name}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
