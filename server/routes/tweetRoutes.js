const express = require("express");
const router = express.Router();
const {
  createTweet,
  getTweetTimeline,
  deleteTweet,
  reactionFunctionality,
} = require("../controllers/tweetController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createTweet);
router.get("/", authMiddleware, getTweetTimeline);
router.delete("/:id", authMiddleware, deleteTweet);

router.put("/:id/like", authMiddleware, reactionFunctionality);
module.exports = router;
