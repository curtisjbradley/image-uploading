import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = process.env.IMAGE_UPLOAD_DIR;
        if (!uploadDir) {
            throw new Error("No upload directory");
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let fileExtension = ""
        switch (file.mimetype) {
            case "image/png":
                fileExtension = ".png"
                break;
            case "image/jpg":
                fileExtension = ".jpeg"
                break;
            default:
                cb(new ImageFormatError("Unsupported image file"), "null");
                return null;
        }
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1E9) + fileExtension);
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}