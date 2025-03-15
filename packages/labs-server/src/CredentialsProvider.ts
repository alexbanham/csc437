import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string): Promise<boolean> {
        // Check if the username already exists
        const existingUser = await this.collection.findOne({ username });
        if (existingUser) {
            return false;
        }
        // Generate a salt and hash the plaintext password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
        // Insert the new user record into the database
        await this.collection.insertOne({
            username,
            password: hashedPassword
        });
        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean> {
        const user = await this.collection.findOne({ username });
        if (!user) {
            return false;
        }
        // Compare the plaintext password with the hashed password from the database
        return bcrypt.compare(plaintextPassword, user.password);
    }
}
