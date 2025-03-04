import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider";

dotenv.config(); // Load .env variables

const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

console.log("Attempting Mongo connection at " + connectionStringRedacted);

async function setUpServer() {
    try {
        const mongoClient = new MongoClient(connectionString);
        await mongoClient.connect();
        console.log("MongoDB Connected!");

        // Debug: List collections
        const collectionInfos = await mongoClient.db().listCollections().toArray();
        console.log("Collections: ", collectionInfos.map(collectionInfo => collectionInfo.name));

        // Create Express app
        const app = express();
        app.use(express.static(staticDir));

        // Hello route
        app.get("/hello", (req: Request, res: Response) => {
            res.send("Hello, World");
        });

        app.get("/api/images", async (req: Request, res: Response) => {
            try {
                const images = await imageProvider.getAllImages();
                res.json(images);
            } catch (error) {
                console.error("Error fetching images:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        // Serve React frontend for any route
        app.get("*", (req: Request, res: Response) => {
            console.log("none of the routes above me were matched");
            res.sendFile(path.resolve(staticDir, "index.html"));
        });

        const imageProvider = new ImageProvider(mongoClient);



        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

// Run the server
setUpServer();
