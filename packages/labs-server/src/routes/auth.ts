import dotenv from "dotenv";
dotenv.config(); // Load env variables before any other imports
import express, {Request, Response, NextFunction, RequestHandler} from "express";
import { MongoClient } from "mongodb";
import { CredentialsProvider } from "../CredentialsProvider";
import jwt from "jsonwebtoken";

// Ensure the JWT secret is available
if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET from env file");
}
const signatureKey: string = process.env.JWT_SECRET;

// Returns a Promise that resolves with a JWT token
function generateAuthToken(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username },
            signatureKey,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

// Middleware to verify the JWT token in the Authorization header
// Explicitly type the middleware as a RequestHandler
export const verifyAuthToken: RequestHandler = (req, res, next) => {
    const authHeader = req.get("Authorization");
    // Expected header format: "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end();
        return;
    }

    jwt.verify(token, signatureKey, (error, decoded) => {
        if (decoded) {
            next();
        } else {
            res.status(403).end();
        }
    });
};

// Registers the /auth/register and /auth/login routes
export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    const router = express.Router();
    const credsProvider = new CredentialsProvider(mongoClient);

    // POST /auth/register
    router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        }

        const success = await credsProvider.registerUser(username, password);
        if (!success) {
            res.status(400).send({
                error: "Bad request",
                message: "Username already taken"
            });
            return;
        }
        res.status(201).end();
    });

    // POST /auth/login
    router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        }

        const isValid = await credsProvider.verifyPassword(username, password);
        if (!isValid) {
            res.status(401).send({
                error: "Unauthorized",
                message: "Incorrect username or password"
            });
            return;
        }

        try {
            const token = await generateAuthToken(username);
            res.send({ token });
        } catch (error) {
            console.error("Error generating token:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Mount the router so these routes are available
    app.use("/", router);
}
