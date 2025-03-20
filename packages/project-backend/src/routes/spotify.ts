// routes/spotify.ts
import express, { Request, Response, NextFunction } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const SCOPES = 'user-read-currently-playing user-read-playback-state user-modify-playback-state user-read-recently-played user-read-private user-read-email user-top-read user-follow-read';

// Helper to generate a random string.
function generateRandomString(length: number): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * GET /auth/spotify/login?app_jwt=...
 *
 * We embed the app's JWT in the state payload under the key "appJwt".
 */
router.get('/auth/spotify/login', (req: Request, res: Response, next: NextFunction) => {
    const appJwt = req.query.app_jwt as string;
    if (!appJwt) {
        res.status(400).send('Missing app_jwt parameter');
        return;
    }
    const statePayload = JSON.stringify({ appJwt, nonce: generateRandomString(8) });
    const state = Buffer.from(statePayload).toString('base64');

    const authQuery = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        state,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${authQuery}`);
});

/**
 * GET /auth/spotify/callback
 *
 * This endpoint decodes the state parameter to retrieve the appJwt,
 * verifies it, and then exchanges the code for Spotify tokens.
 */
router.get('/auth/spotify/callback', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const code = req.query.code as string | undefined;
        const stateParam = req.query.state as string | undefined;
        if (!code || !stateParam) {
            res.status(400).send('Missing code or state parameter');
            return;
        }

        // Decode the state to extract the appJwt.
        let stateObj: { appJwt: string; nonce: string };
        try {
            const decodedState = Buffer.from(stateParam, 'base64').toString();
            stateObj = JSON.parse(decodedState);
        } catch (error) {
            res.status(400).send('Invalid state parameter');
            return;
        }
        const appJwt = stateObj.appJwt;
        if (!appJwt) {
            res.status(400).send('Missing appJwt in state');
            return;
        }

        // Verify the app's JWT.
        let payload: any;
        try {
            payload = jwt.verify(appJwt, process.env.JWT_SECRET!);
        } catch (error) {
            console.error('Error verifying appJwt:', error);
            res.status(400).send('Invalid appJwt');
            return;
        }
        const username = payload.username;
        if (!username) {
            res.status(400).send('Username not found in JWT');
            return;
        }

        try {
            // Exchange the authorization code for Spotify tokens.
            const tokenResponse = await axios.post(
                'https://accounts.spotify.com/api/token',
                querystring.stringify({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
                    },
                }
            );
            const { access_token, refresh_token, expires_in } = tokenResponse.data;

            // Use your SoundSync users collection instead of legacy userCreds.
            const mongoClient = req.app.locals.mongoClient;
            if (!mongoClient) {
                res.status(500).send('Internal Server Error: No MongoClient available');
                return;
            }
            const collectionName = process.env.SOUNDSYNC_USERS_COLLECTION || 'soundSyncUsers';
            await mongoClient.db().collection(collectionName).updateOne(
                { username },
                {
                    $set: {
                        spotifyAccessToken: access_token,
                        spotifyRefreshToken: refresh_token,
                        spotifyTokenExpiresAt: Date.now() + expires_in * 1000,
                    },
                }
            );
            console.log(`Updated Spotify tokens for user: ${username}`);
            res.redirect('https://abanham.csse.dev/?spotifyConnected=true');
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            res.status(500).send('Authentication with Spotify failed');
        }
    })().catch(next);
});

export default router;
