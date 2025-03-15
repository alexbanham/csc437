import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    const imageProvider = new ImageProvider(mongoClient);
    const router = express.Router();

    // GET /api/images with optional filtering by author (createdBy)
    router.get("/", async (req: Request, res: Response): Promise<void> => {
        try {
            let createdBy: string | undefined = undefined;
            if (typeof req.query.createdBy === "string") {
                createdBy = req.query.createdBy;
                console.log("Filtering images by author:", createdBy);
            }
            const images = await imageProvider.getAllImages(createdBy);
            res.json(images);
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // PATCH /api/images/:id to update an image's name
    router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
        const imageId = req.params.id;
        const { name } = req.body;

        // Log the image id and new name
        console.log("Updating image with ID:", imageId, "to new name:", name);

        // Validate request payload for "name"
        if (!name || typeof name !== "string") {
            res.status(400).send({
                error: "Bad request",
                message: "Missing name property"
            });
            return;
        }

        try {
            // Call the database update function
            const matchedCount = await imageProvider.updateImageName(imageId, name);

            // If no document was matched, respond with a 404 error
            if (matchedCount === 0) {
                res.status(404).send({
                    error: "Not found",
                    message: "Image does not exist"
                });
                return;
            }

            // On success, respond with HTTP 204 No Content
            res.status(204).send();
        } catch (error) {
            console.error("Error updating image:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Mount the router on /api/images
    app.use("/api/images", router);
}
