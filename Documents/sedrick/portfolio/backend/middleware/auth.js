require("dotenv").config();

const jwt = require("jsonwebtoken");

const COOKIE_NAME = "portfolio_admin";
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000
};

function isAdminConfigured() {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
    return Boolean(
        process.env.ADMIN_EMAIL &&
        /^\$2[aby]\$\d\d\$/.test(passwordHash) &&
        process.env.JWT_SECRET &&
        process.env.JWT_SECRET.length >= 32
    );
}

function requireAdmin(req, res, next) {
    if (!isAdminConfigured()) {
        return res.status(503).json({ message: "Admin authentication is not configured." });
    }

    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ message: "Admin login required." });
    }

    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET);
        if (admin.sub !== "admin") {
            return res.status(401).json({ message: "Admin login required." });
        }
        req.admin = admin;
        return next();
    } catch {
        return res.status(401).json({ message: "Admin session is invalid or expired." });
    }
}

module.exports = {
    COOKIE_NAME,
    COOKIE_OPTIONS,
    isAdminConfigured,
    requireAdmin
};
