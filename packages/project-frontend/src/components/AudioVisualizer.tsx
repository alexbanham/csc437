import React from 'react';
import './AudioVisualizer.css'; // Import styles for animation

const AudioVisualizer = () => {
    return (
        <div className="flex space-x-1 items-end">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
        </div>
    );
};

export default AudioVisualizer;
