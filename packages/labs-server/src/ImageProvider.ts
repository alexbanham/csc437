import { MongoClient } from "mongodb";

// Define the User document structure
export interface UserDocument {
    _id: string;
    name: string;
    email: string;
}

// Define the Image document structure
// If you want to store only a string for "author", you can remove "| UserDocument".
export interface ImageDocument {
    _id: string;
    src: string;
    name: string;
    author: string | UserDocument;
    likes: number;
}

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    /**
     * Retrieves all images, optionally filtered by a specific author (createdBy).
     * This simplified version does NOT fetch user documents, so newly-uploaded images
     * with author = "unknown" or any string will still be returned and displayed.
     */
    async getAllImages(createdBy?: string): Promise<ImageDocument[]> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!imagesCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const db = this.mongoClient.db();
        const imagesCollection = db.collection<ImageDocument>(imagesCollectionName);

        // Build a simple filter object
        const filter: any = {};
        if (createdBy) {
            filter.author = createdBy;
        }

        // Return images directly from the collection
        const images = await imagesCollection.find(filter).toArray();
        return images;
    }

    /**
     * Updates the image name (stored in the "name" field).
     * Returns the number of documents matched by the query.
     */
    async updateImageName(imageId: string, newName: string): Promise<number> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!imagesCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        const db = this.mongoClient.db();
        const imagesCollection = db.collection<ImageDocument>(imagesCollectionName);

        const result = await imagesCollection.updateOne(
            { _id: imageId },
            { $set: { name: newName } }
        );
        return result.matchedCount;
    }

    /**
     * Creates a new image document in the images collection.
     */
    async createImage(image: ImageDocument): Promise<void> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!imagesCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        const db = this.mongoClient.db();
        const imagesCollection = db.collection<ImageDocument>(imagesCollectionName);
        await imagesCollection.insertOne(image);
    }
}
