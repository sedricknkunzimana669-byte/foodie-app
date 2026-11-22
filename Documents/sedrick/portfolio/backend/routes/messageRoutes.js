const express = require("express");
const messageController = require("../controllers/messageController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAdmin, messageController.listMessages);
router.post("/", messageController.createMessage);
router.delete("/:id", requireAdmin, messageController.deleteMessage);

module.exports = router;