const Tweet = require("../models/Tweet");
const User = require("../models/User");

const createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }
    const newTweet = new Tweet({
      content: content,
      author: req.user.id,
    });
    const savedTweet = await newTweet.save();
    return res.status(201).json({
      success: true,
      message: "Tweet created successfully",
      tweet: savedTweet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "There was an error creating the tweet",
    });
  }
};

// Tweet Timeline Functionality

const getTweetTimeline = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tweets,
      message: "Timeline fetched successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching tweets..",
    });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: "Tweet not found..",
      });
    }
    if (tweet.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this tweet..",
      });
    }
    await tweet.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Tweet deleted successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in deleting tweet..",
    });
  }
};

const reactionFunctionality = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: "Tweet not found..",
      });
    }

    if (tweet.likes.includes(userId)) {
      tweet.likes = tweet.likes.filter((id) => id.toString() !== userId);
      await tweet.save();

      return res.status(200).json({
        success: true,
        message: "Tweet Unliked successfully..",
        data: tweet,
      });
    } else {
      tweet.likes.push(userId);
      await tweet.save();

      return res.status(200).json({
        success: true,
        message: "Tweet Liked successfully..",
        data: tweet,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in liking/unliking tweet..",
    });
  }
};

module.exports = {
  createTweet,
  getTweetTimeline,
  deleteTweet,
  reactionFunctionality,
};
