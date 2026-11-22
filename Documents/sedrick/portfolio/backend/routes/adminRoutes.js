const express = require("express");
const profileController = require("../controllers/profileController");
const { createResourceController, resources } = require("../controllers/resourceController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", profileController.getProfile);
router.put("/profile", requireAdmin, profileController.updateProfile);

for (const name of ["education", "skills", "services"]) {
    const controller = createResourceController(resources[name]);
    router.get(`/${name}`, controller.list);
    router.post(`/${name}`, requireAdmin, controller.create);
    router.put(`/${name}/:id`, requireAdmin, controller.update);
    router.delete(`/${name}/:id`, requireAdmin, controller.remove);
}

module.exports = router;