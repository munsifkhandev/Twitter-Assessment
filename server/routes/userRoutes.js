const express = require("express");
const router = express.Router();

const {
  followUnfollowUser,
  getUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
router.put("/:id/follow", authMiddleware, followUnfollowUser);
router.get("/:id", authMiddleware, getUser);

module.exports = router;
