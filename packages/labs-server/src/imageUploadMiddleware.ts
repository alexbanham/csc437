import { Request, Response, NextFunction } from "express";
import multer from "multer";

export class ImageFormatError extends Error {}

const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";

// Configure multer storage engine
const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, IMAGE_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        let fileExtension = "";
        if (file.mimetype === "image/png") {
            fileExtension = ".png";
        } else if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
            fileExtension = ".jpg";
        } else {
            return cb(new ImageFormatError("Unsupported image type"), "");
        }
        // Generate a unique filename
        const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + fileExtension;
        cb(null, fileName);
    }
});

// Create a multer instance with limits
export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

// Error-handling middleware for multer and image format errors
export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Let any other errors pass along.
}
