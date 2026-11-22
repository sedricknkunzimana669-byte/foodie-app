const express = require("express");
const { imageUpload } = require("../config/imageUploads");
const { requireAdmin } = require("../middleware/auth");
const multer = require("multer");

const router = express.Router();

router.post("/images", requireAdmin, (req, res, next) => {
    imageUpload.single("image")(req, res, (error) => {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ message: "Image must be 5 MB or smaller." });
        }
        if (error && error.status === 400) {
            return res.status(400).json({ message: error.message });
        }
        if (error) return next(error);
        if (!req.file) {
            return res.status(400).json({ message: "Choose an image to upload." });
        }
        return res.status(201).json({ url: `/uploads/${req.file.filename}` });
    });
});

module.exports = router;
