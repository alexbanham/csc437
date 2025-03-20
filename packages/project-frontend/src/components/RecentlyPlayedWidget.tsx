// src/components/RecentlyPlayedWidget.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaPlay } from 'react-icons/fa';

interface Track {
    track: {
        album: {
            images: { url: string }[];
        };
        name: string;
        artists: { name: string }[];
        uri: string;
    };
    played_at: string;
}

interface RecentlyPlayedData {
    items: Track[];
    next: string | null;
    cursors: any;
    limit: number;
}

export default function RecentlyPlayedWidget() {
    const [recentTracks, setRecentTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentTracks = async () => {
        try {
            const response = await api.get<RecentlyPlayedData>('/api/player/recent');
            if (response.data && response.data.items) {
                setRecentTracks(response.data.items);
            }
        } catch (error) {
            console.error('Error fetching recently played tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentTracks();
        const intervalId = setInterval(() => {
            fetchRecentTracks();
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const handlePlayTrack = async (uri: string) => {
        try {
            await api.post('/api/player/play-track', { uri });
        } catch (error) {
            console.error('Error playing track:', error);
            alert('Failed to play track.');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-6">
                <p className="text-2xl dark:text-white">Loading recently played tracks...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl ring-2 ring-gray-300 dark:ring-gray-700 p-12 rounded-xl h-[36rem] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Recently Played Tracks</h2>
            {recentTracks.length === 0 ? (
                <p className="text-center text-xl dark:text-gray-300">No recently played tracks found.</p>
            ) : (
                <ul className="space-y-8">
                    {recentTracks.map((item, index) => {
                        const track = item.track;
                        const albumCover = track.album.images[0]?.url;
                        const trackName = track.name;
                        const artistNames = track.artists.map((artist) => artist.name).join(', ');
                        const playedAt = new Date(item.played_at).toLocaleTimeString();
                        return (
                            <li
                                key={index}
                                className="group cursor-pointer flex items-center space-x-6"
                                onClick={() => handlePlayTrack(track.uri)}
                            >
                                <div className="relative">
                                    {albumCover && (
                                        <img
                                            src={albumCover}
                                            alt={trackName}
                                            className="w-20 h-20 rounded transition duration-300 group-hover:brightness-75"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FaPlay className="text-white text-3xl opacity-0 group-hover:opacity-100 transition duration-300" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-xl">{trackName}</p>
                                    <p className="text-base text-gray-600 dark:text-gray-300">{artistNames}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Played at: {playedAt}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
