const express = require("express");
const { rateLimit } = require("express-rate-limit");
const authController = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many sign-in attempts. Try again later." }
});

router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAdmin, authController.getCurrentAdmin);

module.exports = router;