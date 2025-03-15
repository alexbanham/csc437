import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { registerAuthRoutes } from "./routes/auth";
import { registerImageRoutes } from "./routes/images";
import { imageMiddlewareFactory, handleImageFileErrors } from "./imageUploadMiddleware";
import { ImageProvider, ImageDocument } from "./ImageProvider";

dotenv.config();

const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

async function setUpServer() {
    try {
        const mongoClient = new MongoClient(connectionString);
        await mongoClient.connect();
        console.log("MongoDB Connected!");

        // Log available collections for debugging.
        const collectionInfos = await mongoClient.db().listCollections().toArray();
        console.log("Collections: ", collectionInfos.map(info => info.name));

        const app = express();
        app.use(express.static(staticDir));
        app.use(express.json());

        // Serve uploaded images from the IMAGE_UPLOAD_DIR folder.
        app.use("/uploads", express.static(path.resolve(IMAGE_UPLOAD_DIR)));

        // Register auth and image routes.
        registerAuthRoutes(app, mongoClient);
        registerImageRoutes(app, mongoClient);

        // POST /api/images endpoint for handling file uploads.
        // The file input in the frontend should have name="image".
        app.post(
            "/api/images",
            imageMiddlewareFactory.single("image"),
            handleImageFileErrors,
            async (req: Request, res: Response): Promise<void> => {
                if (!req.file || !req.body.name) {
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Missing image file or title."
                    });
                    return;
                }

                // Retrieve uploader's username from token (or default to "unknown")
                const tokenData = res.locals.token || { username: "unknown" };
                const author: string = tokenData.username;

                // Create the new image document with matching fields.
                const newImage: ImageDocument = {
                    _id: req.file.filename,
                    src: `/uploads/${req.file.filename}`, // Use src instead of url
                    name: req.body.name, // Use name instead of title
                    author,
                    likes: 0,
                };

                const imageProvider = new ImageProvider(mongoClient);
                try {
                    await imageProvider.createImage(newImage);
                    res.status(201).send(newImage);
                } catch (err) {
                    console.error("Error creating image document:", err);
                    res.status(500).send("Internal Server Error");
                }
            }
        );

        // Fallback route for serving the frontend (e.g., index.html).
        app.get("*", (req: Request, res: Response) => {
            res.sendFile(path.resolve(staticDir, "index.html"));
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

setUpServer();
