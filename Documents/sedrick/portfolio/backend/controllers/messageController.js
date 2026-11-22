const db = require("../config/db");

async function listMessages(req, res) {
    try {
        const [rows] = await db.query(
            "SELECT id, name, email, subject, message, created_at FROM messages ORDER BY id DESC"
        );
        return res.json(rows);
    } catch (error) {
        console.error("Could not load messages:", error.message);
        return res.status(500).json({ message: "Could not load messages." });
    }
}

async function deleteMessage(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "A valid message ID is required." });
    }

    try {
        const [result] = await db.query("DELETE FROM messages WHERE id = ?", [id]);
        if (!result.affectedRows) {
            return res.status(404).json({ message: "Message not found." });
        }
        return res.json({ message: "Message deleted." });
    } catch (error) {
        console.error("Could not delete message:", error.message);
        return res.status(500).json({ message: "Could not delete message." });
    }
}

async function createMessage(req, res) {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length > 150 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        subject.length > 200 || !message || message.length > 5000) {
        return res.status(400).json({
            message: "Enter a valid name, email, and message. Please keep each field within its length limit."
        });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
            [name, email, subject || null, message]
        );
        return res.status(201).json({
            message: "Thank you for contacting me!",
            id: result.insertId
        });
    } catch (error) {
        console.error("Could not save contact message:", error.message);
        return res.status(500).json({
            message: "Your message could not be saved. Please try again later."
        });
    }
}

module.exports = { listMessages, deleteMessage, createMessage };