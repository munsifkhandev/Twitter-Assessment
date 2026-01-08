const express = require("express");
const router = express.Router();
const { followUnfollowUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
router.put("/:id/follow", authMiddleware, followUnfollowUser);
module.exports = router;
