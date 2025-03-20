// routes/player.ts
import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Simple in-memory caches keyed by username.
const shuffleCache: { [username: string]: boolean } = {};
const repeatCache: { [username: string]: string } = {}; // values: 'off', 'context', 'track'

/**
 * Retrieves the Spotify access token for the authenticated user from the DB.
 */
export async function getSpotifyToken(req: Request): Promise<string | null> {
    const authHeader = req.get("Authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    let payload: any;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        console.error("JWT verification error:", err);
        return null;
    }
    const username = payload.username;
    if (!username) return null;

    const mongoClient = req.app.locals.mongoClient;
    if (!mongoClient) {
        console.error("MongoClient not found in app.locals");
        return null;
    }
    const collectionName = process.env.SOUNDSYNC_USERS_COLLECTION || 'soundSyncUsers';
    const userRecord = await mongoClient.db().collection(collectionName).findOne({ username });
    return userRecord?.spotifyAccessToken || null;
}

// GET current playback info (works fine)
router.get('/api/player/current', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.send(response.data);
        } catch (error: any) {
            console.error("Error fetching current playback:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to fetch current playback' });
        }
    })().catch(next);
});

// POST play command
router.post('/api/player/play', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.put('https://api.spotify.com/v1/me/player/play', {}, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            console.log("Play response:", response.data);
            res.sendStatus(204);
        } catch (error: any) {
            console.error("Error playing track:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to play track' });
        }
    })().catch(next);
});

// POST pause command
router.post('/api/player/pause', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.put('https://api.spotify.com/v1/me/player/pause', {}, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            console.log("Pause response:", response.data);
            res.sendStatus(204);
        } catch (error: any) {
            console.error("Error pausing track:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to pause track' });
        }
    })().catch(next);
});

// POST skip command
router.post('/api/player/skip', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.post('https://api.spotify.com/v1/me/player/next', {}, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            console.log("Skip response:", response.data);
            res.sendStatus(204);
        } catch (error: any) {
            console.error("Error skipping track:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to skip track' });
        }
    })().catch(next);
});

// POST previous track
router.post('/api/player/previous', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.post('https://api.spotify.com/v1/me/player/previous', {}, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            console.log("Previous track response:", response.data);
            res.sendStatus(204);
        } catch (error: any) {
            console.error("Error going to previous track:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to go to previous track' });
        }
    })().catch(next);
});

/** Toggle Shuffle Endpoint
 *  If the API doesn't return a shuffle_state, default to false.
 */
router.put('/api/player/shuffle/toggle', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });

        // Retrieve current playback info.
        const playbackResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${spotifyToken}` },
        });
        console.log("Playback response for shuffle toggle:", playbackResponse.data);

        // Determine username from JWT.
        const authHeader = req.get("Authorization");
        const token = authHeader?.split(" ")[1];
        let payload: any = {};
        try {
            payload = jwt.verify(token!, process.env.JWT_SECRET!);
        } catch (err) {
            console.error("JWT verification error in shuffle toggle:", err);
        }
        const username = payload.username || 'unknown';

        // Use the returned value if present, otherwise fall back to cache.
        let currentShuffle: boolean = false;
        if (typeof playbackResponse.data.shuffle_state === 'boolean') {
            currentShuffle = playbackResponse.data.shuffle_state;
        } else if (username in shuffleCache) {
            currentShuffle = shuffleCache[username];
        } else {
            currentShuffle = false; // default off
        }

        const newState = !currentShuffle;
        console.log(`Toggling shuffle for ${username}: current=${currentShuffle}, new=${newState}`);

        // Send the toggle command.
        await axios.put('https://api.spotify.com/v1/me/player/shuffle', null, {
            params: { state: newState },
            headers: { 'Authorization': `Bearer ${spotifyToken}` },
        });

        // Update our cache.
        shuffleCache[username] = newState;

        res.sendStatus(204);
    })().catch(next);
});

/** Toggle Repeat Endpoint
 *  If repeat_state isn't returned, default to 'off'.
 *  Cycle through: off -> context -> track -> off.
 */
router.put('/api/player/repeat/toggle', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });

        // Retrieve current playback info.
        const playbackResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${spotifyToken}` },
        });
        console.log("Playback response for repeat toggle:", playbackResponse.data);

        // Determine username from JWT.
        const authHeader = req.get("Authorization");
        const token = authHeader?.split(" ")[1];
        let payload: any = {};
        try {
            payload = jwt.verify(token!, process.env.JWT_SECRET!);
        } catch (err) {
            console.error("JWT verification error in repeat toggle:", err);
        }
        const username = payload.username || 'unknown';

        // Use the returned repeat_state if present, otherwise fall back to our cache.
        let currentRepeat: string = 'off';
        if (playbackResponse.data.repeat_state) {
            currentRepeat = playbackResponse.data.repeat_state;
        } else if (username in repeatCache) {
            currentRepeat = repeatCache[username];
        } else {
            currentRepeat = 'off';
        }

        // Cycle through modes: off -> context -> track -> off.
        let newRepeat: string;
        if (currentRepeat === 'off') newRepeat = 'context';
        else if (currentRepeat === 'context') newRepeat = 'track';
        else newRepeat = 'off';
        console.log(`Toggling repeat for ${username}: current=${currentRepeat}, new=${newRepeat}`);

        // Send the toggle command.
        await axios.put('https://api.spotify.com/v1/me/player/repeat', null, {
            params: { state: newRepeat },
            headers: { 'Authorization': `Bearer ${spotifyToken}` },
        });

        // Update our cache.
        repeatCache[username] = newRepeat;

        res.sendStatus(204);
    })().catch(next);
});

// GET recently played tracks endpoint (with limit if needed)
router.get('/api/player/recent', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            // Optionally set a limit here (default is 20)
            const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
                params: { limit: 10 },
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.send(response.data);
        } catch (error: any) {
            console.error("Error fetching recently played tracks:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to fetch recently played tracks' });
        }
    })().catch(next);
});

// GET recent playlists endpoint (limit to 10)
router.get('/api/player/playlists', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                params: { limit: 10 },
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.send(response.data);
        } catch (error: any) {
            console.error("Error fetching playlists:", error.response?.data || error.message);
            res.status(500).send({ error: 'Failed to fetch playlists' });
        }
    })().catch(next);
});

// routes/player.ts – updated play-track endpoint
router.post('/api/player/play-track', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const spotifyToken = await getSpotifyToken(req);
        if (!spotifyToken) return res.status(401).send({ error: 'Spotify not connected' });

        const { uri } = req.body;
        if (!uri) return res.status(400).send({ error: 'Missing track URI' });

        try {
            // This call starts playback with the specified track URI.
            await axios.put('https://api.spotify.com/v1/me/player/play', { uris: [uri] }, {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
            });
            res.sendStatus(204);
        } catch (error: unknown) {
            // Cast error to any (or use a type guard) to access properties.
            const err = error as any;
            console.error('Error playing track by URI:', err.response?.data || err.message);
            res.status(500).send({ error: 'Failed to play track' });
        }
    })().catch(next);
});


export default router;
