import React, { useRef, useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import AudioVisualizer from './AudioVisualizer';

export default function FriendModal({ friend, isOpen, onClose, darkMode }) {
    if (!isOpen || !friend) return null;

    const modalRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // Simulate a loading delay when modal opens
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [friend]);

    // Close modal when clicking outside
    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={handleOverlayClick}>
            <div ref={modalRef} className={`rounded-lg shadow-lg max-w-lg w-full p-6 relative border transition 
        ${darkMode ? 'bg-gray-900 text-white border-green-500' : 'bg-white text-black border-gray-300'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-3 right-3 text-gray-500 transition text-3xl p-2
            ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
                >
                    &times;
                </button>

                {/* Loading Indicator */}
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-10 h-10 border-4 border-green-400 border-dashed rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center space-x-4 mb-4">
                            <img src={friend.avatar} alt={friend.friendName} className="w-16 h-16 rounded-full border-2 border-green-500" />
                            <h2 className="text-2xl font-bold">{friend.friendName}</h2>
                        </div>

                        {/* If friend is actively listening */}
                        {friend.song && (
                            <div className={`flex items-center justify-between p-4 rounded-lg shadow-md transition
            ${darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-200 text-green-700'}`}>
                                <p className="text-lg font-semibold">Now Playing: {friend.song}</p>
                                <div className="flex items-center space-x-2">
                                    <AudioVisualizer /> {/* Animated Audio Indicator */}
                                    <button
                                        className="w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-500 rounded-full transition"
                                        onClick={() => alert(`Pretend your Spotify is now playing: ${friend.song}`)}
                                    >
                                        <FaPlay className="text-white text-lg"/>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* If friend is a recent listener */}
                        {!friend.song && friend.activity && (
                            <div className={`p-4 rounded-lg shadow-md transition ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <p className="text-lg font-semibold">{friend.activity}</p>
                                <p className="text-xs text-gray-400">{friend.timestamp}</p>
                            </div>
                        )}

                        {/* Recently Played List */}
                        <h3 className="mt-4 text-xl font-semibold">Recently Listened:</h3>
                        <ul className="mt-2 space-y-2">
                            {friend.recentTracks.map((track, index) => (
                                <li key={index} className={`p-2 rounded-lg shadow text-sm transition 
              ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}>
                                    {track}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
