const express = require("express");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

router.get("/", ensureAuth, (req, res) => {
  const { _id, email, createdAt, updatedAt } = req.user;

  res.json({
    message: "Protected content",
    user: { _id, email, createdAt, updatedAt },
  });
});

module.exports = router;
