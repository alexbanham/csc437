// src/components/Player.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
    FaPlay,
    FaPause,
    FaStepForward,
    FaStepBackward,
    FaRandom,
    FaRedo
} from 'react-icons/fa';

interface PlaybackData {
    item: {
        album: {
            images: { url: string }[];
        };
        name: string;
        artists: { name: string }[];
        duration_ms: number;
    } | null;
    progress_ms: number;
    is_playing: boolean;
    shuffle_state?: boolean;
    repeat_state?: string;
}

export default function Player() {
    const [playback, setPlayback] = useState<PlaybackData | null>(null);
    const [progress, setProgress] = useState(0);

    const fetchCurrentPlayback = async () => {
        try {
            const response = await api.get('/api/player/current');
            if (response.data) {
                setPlayback(response.data);
                setProgress(response.data.progress_ms);
            } else {
                setPlayback(null);
            }
        } catch (error) {
            console.error('Error fetching playback info', error);
        }
    };

    useEffect(() => {
        fetchCurrentPlayback();
        const intervalId = setInterval(() => {
            fetchCurrentPlayback();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;
        if (playback && playback.is_playing) {
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + 1000;
                    const duration = playback.item?.duration_ms ?? 0;
                    return newProgress > duration ? duration : newProgress;
                });
            }, 1000);
        }
        return () => progressInterval && clearInterval(progressInterval);
    }, [playback]);

    const handlePlay = async () => {
        try {
            await api.post('/api/player/play');
            fetchCurrentPlayback();
        } catch (error) {
            console.error('Error playing track', error);
        }
    };

    const handlePause = async () => {
        try {
            await api.post('/api/player/pause');
            fetchCurrentPlayback();
        } catch (error) {
            console.error('Error pausing track', error);
        }
    };

    const handleSkip = async () => {
        try {
            await api.post('/api/player/skip');
            fetchCurrentPlayback();
        } catch (error) {
            console.error('Error skipping track', error);
        }
    };

    const handlePrevious = async () => {
        try {
            await api.post('/api/player/previous');
            fetchCurrentPlayback();
        } catch (error) {
            console.error('Error going to previous track', error);
        }
    };

    const handleToggleShuffle = async () => {
        try {
            await api.put('/api/player/shuffle/toggle');
            fetchCurrentPlayback();
        } catch (error: any) {
            const errMsg = error.response?.data?.error?.message || 'Failed to toggle shuffle';
            alert(`Shuffle Error: ${errMsg}. The current playback may not support shuffling.`);
        }
    };

    const handleToggleRepeat = async () => {
        try {
            await api.put('/api/player/repeat/toggle');
            fetchCurrentPlayback();
        } catch (error: any) {
            const errMsg = error.response?.data?.error?.message || 'Failed to toggle repeat';
            alert(`Repeat Error: ${errMsg}. The current playback may not support looping.`);
        }
    };

    if (!playback || !playback.item) {
        return (
            <div className="text-center py-12">
                <p className="text-2xl">No song is currently playing.</p>
                <p className="text-base text-gray-600 dark:text-gray-300 mt-2">
                    Start a track in Spotify to see it here.
                </p>
            </div>
        );
    }

    const { item, is_playing } = playback;
    const albumCover = item.album.images[0]?.url;
    const trackName = item.name;
    const artistNames = item.artists.map(artist => artist.name).join(', ');
    const duration = item.duration_ms ?? 0;
    const progressPercentage = duration ? Math.min((progress / duration) * 100, 100) : 0;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl ring-2 ring-gray-300 dark:ring-gray-700 p-12 rounded-xl">
            <div className="flex items-center">
                {albumCover && (
                    <img src={albumCover} alt={trackName} className="w-28 h-28 rounded mr-8" />
                )}
                <div>
                    <h3 className="text-3xl font-bold">{trackName}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">{artistNames}</p>
                </div>
            </div>
            <div className="mt-8">
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="mt-8 flex justify-around text-4xl">
                <button onClick={handlePrevious} className="text-green-600 hover:text-green-800">
                    <FaStepBackward/>
                </button>
                {is_playing ? (
                    <button onClick={handlePause} className="text-green-600 hover:text-green-800">
                        <FaPause/>
                    </button>
                ) : (
                    <button onClick={handlePlay} className="text-green-600 hover:text-green-800">
                        <FaPlay/>
                    </button>
                )}
                <button onClick={handleSkip} className="text-green-600 hover:text-green-800">
                    <FaStepForward/>
                </button>
                <button onClick={handleToggleShuffle} className="text-green-600 hover:text-green-800">
                    <FaRandom/>
                </button>
                <button onClick={handleToggleRepeat} className="text-green-600 hover:text-green-800">
                    <FaRedo/>
                </button>
            </div>
        </div>
    );
}
