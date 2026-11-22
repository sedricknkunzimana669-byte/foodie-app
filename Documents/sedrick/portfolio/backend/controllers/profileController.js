const db = require("../config/db");

async function getProfile(req, res) {
    try {
        const [rows] = await db.query(
            "SELECT name, profession, email, location, bio, photo_url FROM profile WHERE id = 1"
        );
        return res.json(rows[0] || null);
    } catch (error) {
        console.error("Could not load profile:", error.message);
        return res.status(500).json({ message: "Could not load profile." });
    }
}

async function updateProfile(req, res) {
    const body = req.body || {};
    const profile = {
        name: typeof body.name === "string" ? body.name.trim() : "",
        profession: typeof body.profession === "string" ? body.profession.trim() : "",
        email: typeof body.email === "string" ? body.email.trim() : "",
        location: typeof body.location === "string" ? body.location.trim() : "",
        bio: typeof body.bio === "string" ? body.bio.trim() : "",
        photo_url: typeof body.photo_url === "string" ? body.photo_url.trim() : ""
    };

    if (!profile.name || !profile.profession || !profile.email ||
        profile.name.length > 150 || profile.profession.length > 150 ||
        profile.email.length > 254 || profile.location.length > 150 ||
        profile.bio.length > 5000 || profile.photo_url.length > 2048) {
        return res.status(400).json({
            message: "Complete the required fields and keep values within their length limits."
        });
    }

    try {
        await db.query(
            `INSERT INTO profile (id, name, profession, email, location, bio, photo_url)
             VALUES (1, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name), profession = VALUES(profession),
             email = VALUES(email), location = VALUES(location), bio = VALUES(bio), photo_url = VALUES(photo_url)`,
            [
                profile.name,
                profile.profession,
                profile.email,
                profile.location || null,
                profile.bio || null,
                profile.photo_url || null
            ]
        );
        return res.json({ message: "Profile saved.", profile });
    } catch (error) {
        console.error("Could not save profile:", error.message);
        return res.status(500).json({ message: "Could not save profile." });
    }
}

module.exports = { getProfile, updateProfile };
