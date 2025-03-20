import React, { useState } from 'react';
import api from "../api/axiosConfig.ts";

interface LoginProps {
    onLogin: (token: string) => void;
    onToggleRegister: () => void;
    darkMode: boolean;
}

export default function Login({ onLogin, onToggleRegister, darkMode }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            if (response.data.token) {
                onLogin(response.data.token);
            }
        } catch (err: any) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
            {/* Branding */}
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">SoundSync</h1>
                <p className="mt-2 text-xl text-white">Connect with friends through music</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">
                    Login
                </button>
            </form>
            <div className="mt-4">
                <button className="text-white underline" onClick={onToggleRegister}>
                    Don't have an account? Register here.
                </button>
            </div>
        </div>
    );
}
