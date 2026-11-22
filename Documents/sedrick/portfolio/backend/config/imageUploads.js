const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIRECTORY = path.join(__dirname, "..", "uploads");
const imageExtensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
};

const imageUpload = multer({
    storage: multer.diskStorage({
        destination: UPLOAD_DIRECTORY,
        filename: (req, file, callback) => {
            callback(null, `${crypto.randomBytes(16).toString("hex")}${imageExtensions[file.mimetype]}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, callback) => {
        if (!imageExtensions[file.mimetype]) {
            const error = new Error("Upload a JPG, PNG, WEBP, or GIF image.");
            error.status = 400;
            return callback(error);
        }
        return callback(null, true);
    }
});

module.exports = { UPLOAD_DIRECTORY, imageUpload };
