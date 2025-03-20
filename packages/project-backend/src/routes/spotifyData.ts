// routes/spotifyData.ts
import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { getSpotifyToken } from './player'; // if you already have it exported from player.ts

dotenv.config();

const router = express.Router();

// GET user profile
router.get('/api/spotify/profile', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.get('https://api.spotify.com/v1/me', {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.send(response.data);
        } catch (error: any) {
            console.error('Error fetching Spotify profile:', error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to fetch Spotify profile' });
        }
    })().catch(next);
});

// GET user's top items (tracks or artists)
// Query parameter "type" should be either "tracks" or "artists"
router.get('/api/spotify/top', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const type = req.query.type as string || 'tracks';
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
                params: { limit: 10 },
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.send(response.data);
        } catch (error: any) {
            console.error('Error fetching top items:', error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to fetch top items' });
        }
    })().catch(next);
});

// GET user's followed artists
router.get('/api/spotify/followed', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/following', {
                params: { type: 'artist', limit: 10 },
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.send(response.data);
        } catch (error: any) {
            console.error('Error fetching followed artists:', error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to fetch followed artists' });
        }
    })().catch(next);
});

export default router;
