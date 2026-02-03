const express = require("express");
const ensureAuth = require("../middleware/ensureAuth");
const controller = require("../controllers/users.controller");

const router = express.Router();

router.get("/", ensureAuth, controller.findAll);
router.get("/search", ensureAuth, controller.findByQuery);

router.get("/cursor", ensureAuth, controller.findByCursor);
router.get("/stats", ensureAuth, controller.getStats);

router.post("/one", ensureAuth, controller.createOne);
router.post("/many", ensureAuth, controller.createMany);

router.patch("/one/:id", ensureAuth, controller.updateOne);
router.patch("/many", ensureAuth, controller.updateMany);
router.put("/replace/:id", ensureAuth, controller.replaceOne);

router.delete("/one/:id", ensureAuth, controller.deleteOne);
router.delete("/many", ensureAuth, controller.deleteMany);

module.exports = router;
