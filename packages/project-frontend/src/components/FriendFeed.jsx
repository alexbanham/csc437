import React, { useState, useEffect } from 'react';
import FriendModal from './FriendModal';
import { activeListeners, recentListeners } from '../data/mockFriends'; // ✅ Importing mock data
import AudioVisualizer from './AudioVisualizer';
import {FaPlay} from "react-icons/fa"; // Import visualizer

export default function FriendFeed({ darkMode }) {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulate fetching data with a delay
    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Friends' Listening Activity</h2>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-green-400 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Active Listeners Section */}
                    <section>
                        <h3 className="text-2xl font-semibold mb-3">Active Listeners</h3>
                        <div className="space-y-4">
                            {activeListeners.map((item) => (
                                <div key={item.id} className={`p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer transition
        ${darkMode ? 'bg-green-900 text-white hover:bg-green-800' : 'bg-green-100 text-black hover:bg-green-200'}`}
                                     onClick={() => setSelectedFriend(item)}
                                >
                                    <img src={item.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.friendName}</h3>
                                        <p className="text-sm">Currently listening to {item.song}</p>
                                    </div>

                                    {/* Audio Visualizer + Play Button */}
                                    <div className="flex items-center space-x-2">
                                        <AudioVisualizer />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Listeners */}
                    <section>
                        <h3 className="text-2xl font-semibold mb-3">Recent Listeners</h3>
                        <div className="space-y-4">
                            {recentListeners.map((item) => (
                                <div key={item.id} className={`p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer transition
                  ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                                     onClick={() => setSelectedFriend(item)}
                                >
                                    <img src={item.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.friendName}</h3>
                                        <p className="text-sm">{item.activity}</p>
                                        <p className="text-xs text-gray-500">{item.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {/* Modal */}
            <FriendModal friend={selectedFriend} isOpen={!!selectedFriend} onClose={() => setSelectedFriend(null)} darkMode={darkMode} />
        </div>
    );
}
