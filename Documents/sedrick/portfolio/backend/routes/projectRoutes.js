const express = require("express");
const projectController = require("../controllers/projectController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", projectController.list);
router.post("/", requireAdmin, projectController.create);
router.put("/:id", requireAdmin, projectController.update);
router.delete("/:id", requireAdmin, projectController.remove);

module.exports = router;