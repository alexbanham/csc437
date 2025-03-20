// index.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { registerAuthRoutes } from "./routes/auth";
import spotifyAuthRouter from "./routes/spotify";
import spotifyDataRouter from "./routes/spotifyData";

import cors from "cors";
import playerRouter from './routes/player';
dotenv.config();

const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

async function setUpServer() {
    try {
        const mongoClient = new MongoClient(connectionString);
        await mongoClient.connect();
        console.log("MongoDB Connected!");

        const collectionInfos = await mongoClient.db().listCollections().toArray();
        console.log("Collections: ", collectionInfos.map(info => info.name));

        const app = express();
        app.locals.mongoClient = mongoClient;
        app.use(cors({
            origin: "*"
        }));

        app.use(express.static(staticDir));
        app.use(express.json());
        app.use(playerRouter);
        // Register our authentication routes.
        registerAuthRoutes(app, mongoClient);
        // Mount Spotify auth routes at '/'.
        app.use('/', spotifyAuthRouter);
        app.use(spotifyDataRouter)
        // Fallback route for serving the frontend.
        app.get("*", (req: Request, res: Response) => {
            res.sendFile(path.resolve(staticDir, "index.html"));
        });

        app.listen(PORT, () => {
            console.log(`SoundSync Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

setUpServer();
