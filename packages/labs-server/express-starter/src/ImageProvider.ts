import { MongoClient, ObjectId } from "mongodb";

// Define the User document structure
interface UserDocument {
    _id: string;
    name: string;
    email: string;
}

// Define the Image document structure
interface ImageDocument {
    _id: string;
    url: string;
    title: string;
    description: string;
    author: string | UserDocument;  // Allow both string (ID) and UserDocument
}

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImages(): Promise<ImageDocument[]> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const usersCollectionName = process.env.USERS_COLLECTION_NAME;

        if (!imagesCollectionName || !usersCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }

        const db = this.mongoClient.db();
        const imagesCollection = db.collection<ImageDocument>(imagesCollectionName);
        const usersCollection = db.collection<UserDocument>(usersCollectionName);

        // Fetch all images
        const images = await imagesCollection.find().toArray();

        // Get unique user IDs from the images collection
        const userIds = [...new Set(images.map(img => img.author as string))];

        // Fetch user data for all authors in a single query
        const users = await usersCollection.find({ _id: { $in: userIds } }).toArray();

        // Create a user lookup map for quick reference
        const usersMap = new Map(users.map(user => [user._id.toString(), user]));

        // Replace the author ID in each image with the full user object
        for (const image of images) {
            if (typeof image.author === "string" && usersMap.has(image.author)) {
                image.author = usersMap.get(image.author)!;
            }
        }

        return images;
    }
}
