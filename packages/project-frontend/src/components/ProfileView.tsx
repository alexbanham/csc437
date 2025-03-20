// src/components/ProfileView.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaPlay } from 'react-icons/fa';

interface UserProfile {
    display_name: string;
    images: { url: string }[];
    email: string;
    country: string;
}

interface Track {
    album: {
        images: { url: string }[];
    };
    name: string;
    artists: { name: string }[];
    uri: string;
}

interface TopTracksData {
    items: Track[];
}

interface Artist {
    name: string;
    images: { url: string }[];
    external_urls: { spotify: string };
}

interface FollowedArtistsData {
    artists: {
        items: Artist[];
    };
}

export default function ProfileView() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [topTracks, setTopTracks] = useState<TopTracksData | null>(null);
    const [followedArtists, setFollowedArtists] = useState<FollowedArtistsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfileData = async () => {
        try {
            const [profileRes, topTracksRes, followedArtistsRes] = await Promise.all([
                api.get('/api/spotify/profile'),
                api.get('/api/spotify/top', { params: { type: 'tracks', limit: 10 } }),
                api.get('/api/spotify/followed', { params: { type: 'artist', limit: 10 } }),
            ]);
            setProfile(profileRes.data);
            setTopTracks(topTracksRes.data);
            setFollowedArtists(followedArtistsRes.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Handler to play a specific track by its URI.
    const handlePlayTrack = async (uri: string) => {
        try {
            await api.post('/api/player/play-track', { uri });
        } catch (error) {
            console.error('Error playing track:', error);
            alert('Failed to play track.');
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-2xl">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>
            {profile && (
                <div className="flex flex-col sm:flex-row items-center mb-12">
                    {profile.images && profile.images.length > 0 && (
                        <img
                            src={profile.images[0].url}
                            alt={profile.display_name}
                            className="w-32 h-32 rounded-full mr-6"
                        />
                    )}
                    <div>
                        <p className="text-2xl font-semibold">{profile.display_name}</p>
                        <p className="text-lg">{profile.email}</p>
                        <p className="text-lg">Country: {profile.country}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Tracks Section */}
                <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-lg h-80 overflow-y-auto">
                    <h3 className="text-2xl font-bold mb-4">Top Tracks</h3>
                    {topTracks && topTracks.items.length > 0 ? (
                        <ul className="space-y-4">
                            {topTracks.items.map((track, index) => {
                                const albumCover = track.album.images[0]?.url;
                                const trackName = track.name;
                                const artistNames = track.artists.map(artist => artist.name).join(', ');
                                return (
                                    <li
                                        key={index}
                                        className="group cursor-pointer flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                                        onClick={() => handlePlayTrack(track.uri)}
                                    >
                                        <div className="relative">
                                            {albumCover && (
                                                <img
                                                    src={albumCover}
                                                    alt={trackName}
                                                    className="w-16 h-16 rounded transition duration-300 group-hover:brightness-75"
                                                />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FaPlay className="text-white text-2xl opacity-0 group-hover:opacity-100 transition duration-300" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{trackName}</p>
                                            <p className="text-base text-gray-600 dark:text-gray-300">{artistNames}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No top tracks found.</p>
                    )}
                </div>

                {/* Followed Artists Section */}
                <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-lg h-80 overflow-y-auto">
                    <h3 className="text-2xl font-bold mb-4">Followed Artists</h3>
                    {followedArtists && followedArtists.artists.items.length > 0 ? (
                        <ul className="space-y-4">
                            {followedArtists.artists.items.map((artist, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition cursor-pointer"
                                    onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                                >
                                    {artist.images && artist.images[0] && (
                                        <img
                                            src={artist.images[0].url}
                                            alt={artist.name}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold text-lg">{artist.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No followed artists found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
