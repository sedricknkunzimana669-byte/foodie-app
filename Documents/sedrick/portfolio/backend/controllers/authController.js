const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    COOKIE_NAME,
    COOKIE_OPTIONS,
    isAdminConfigured
} = require("../middleware/auth");

async function login(req, res) {
    if (!isAdminConfigured()) {
        return res.status(503).json({ message: "Admin authentication is not configured." });
    }

    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const passwordMatches = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        if (email !== process.env.ADMIN_EMAIL.trim().toLowerCase() || !passwordMatches) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { sub: "admin", email: process.env.ADMIN_EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
        return res.json({ email: process.env.ADMIN_EMAIL });
    } catch (error) {
        console.error("Admin login failed:", error.message);
        return res.status(500).json({ message: "Could not log in." });
    }
}

function logout(req, res) {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    return res.json({ message: "Logged out." });
}

function getCurrentAdmin(req, res) {
    return res.json({ email: req.admin.email });
}

module.exports = { login, logout, getCurrentAdmin };