const db = require("../config/db");

const resources = {
    projects: {
        path: "projects",
        table: "projects",
        fields: ["title", "description", "image"],
        validate: (record) => !record.title || record.title.length > 200 ||
            record.description.length > 5000 || record.image.length > 2048
    },
    education: {
        path: "education",
        table: "education",
        fields: ["title", "institution", "field", "start_year", "end_year", "description"],
        validate: (record) => !record.title || !record.institution ||
            record.title.length > 200 || record.institution.length > 200 ||
            record.field.length > 200 || record.description.length > 5000 ||
            (record.start_year !== null && (!Number.isInteger(record.start_year) || record.start_year < 1901 || record.start_year > 2155)) ||
            (record.end_year !== null && (!Number.isInteger(record.end_year) || record.end_year < 1901 || record.end_year > 2155)) ||
            (record.start_year !== null && record.end_year !== null && record.end_year < record.start_year)
    },
    services: {
        path: "services",
        table: "services",
        fields: ["title", "description"],
        validate: (record) => !record.title || record.title.length > 200 || record.description.length > 5000
    },
    skills: {
        path: "skills",
        table: "skills",
        fields: ["name", "level"],
        validate: (record) => !record.name || record.name.length > 100 ||
            !Number.isInteger(record.level) || record.level < 0 || record.level > 100
    }
};

function normalizeResourceRecord(resource, body) {
    const record = {};
    for (const field of resource.fields) {
        const value = body[field];
        if (field === "level" || field === "start_year" || field === "end_year") {
            record[field] = value === "" || value === null || value === undefined
                ? null
                : Number(value);
        } else {
            record[field] = typeof value === "string" ? value.trim() : "";
        }
    }
    return record;
}

function createResourceController(resource) {
    const columns = resource.fields.join(", ");
    const placeholders = resource.fields.map(() => "?").join(", ");

    async function list(req, res) {
        try {
            const [rows] = await db.query(`SELECT * FROM ${resource.table} ORDER BY id DESC`);
            return res.json(rows);
        } catch (error) {
            console.error(`Could not load ${resource.path}:`, error.message);
            return res.status(500).json({ message: `Could not load ${resource.path}.` });
        }
    }

    async function create(req, res) {
        const record = normalizeResourceRecord(resource, req.body || {});
        if (resource.validate(record)) {
            return res.status(400).json({ message: "Check the required fields and values." });
        }

        try {
            const [result] = await db.query(
                `INSERT INTO ${resource.table} (${columns}) VALUES (${placeholders})`,
                resource.fields.map((field) => record[field] === "" ? null : record[field])
            );
            return res.status(201).json({ id: result.insertId, ...record });
        } catch (error) {
            console.error(`Could not create ${resource.path} item:`, error.message);
            return res.status(500).json({ message: `Could not create ${resource.path} item.` });
        }
    }

    async function update(req, res) {
        const id = Number(req.params.id);
        const record = normalizeResourceRecord(resource, req.body || {});
        if (!Number.isInteger(id) || id < 1 || resource.validate(record)) {
            return res.status(400).json({ message: "Check the item ID and required values." });
        }

        try {
            const assignments = resource.fields.map((field) => `${field} = ?`).join(", ");
            const [result] = await db.query(
                `UPDATE ${resource.table} SET ${assignments} WHERE id = ?`,
                [...resource.fields.map((field) => record[field] === "" ? null : record[field]), id]
            );
            if (result.affectedRows === 0) {
                const [rows] = await db.query(`SELECT id FROM ${resource.table} WHERE id = ?`, [id]);
                if (!rows.length) {
                    return res.status(404).json({ message: "Item not found." });
                }
            }
            return res.json({ id, ...record });
        } catch (error) {
            console.error(`Could not update ${resource.path} item:`, error.message);
            return res.status(500).json({ message: `Could not update ${resource.path} item.` });
        }
    }

    async function remove(req, res) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ message: "A valid item ID is required." });
        }

        try {
            const [result] = await db.query(`DELETE FROM ${resource.table} WHERE id = ?`, [id]);
            if (!result.affectedRows) {
                return res.status(404).json({ message: "Item not found." });
            }
            return res.json({ message: "Item deleted." });
        } catch (error) {
            console.error(`Could not delete ${resource.path} item:`, error.message);
            return res.status(500).json({ message: `Could not delete ${resource.path} item.` });
        }
    }

    return { list, create, update, remove };
}

module.exports = { resources, createResourceController };
