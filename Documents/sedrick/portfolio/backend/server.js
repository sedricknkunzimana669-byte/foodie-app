require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const db = require("./config/db");
const { UPLOAD_DIRECTORY } = require("./config/imageUploads");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use("/uploads", express.static(UPLOAD_DIRECTORY, {
    dotfiles: "deny",
    index: false,
    setHeaders: (response) => response.setHeader("X-Content-Type-Options", "nosniff")
}));

app.get("/api/test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");
        return res.json({
            success: true,
            message: "MySQL database connected successfully!",
            data: rows
        });
    } catch (error) {
        console.error("Database health check failed:", error.message);
        return res.status(500).json({ success: false, message: "Database connection failed." });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", adminRoutes);

async function startServer() {
    try {
        await db.query("SELECT 1");
        console.log("MySQL connected successfully!");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}

startServer();
