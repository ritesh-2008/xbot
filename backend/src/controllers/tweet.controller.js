const twitterService = require('../services/twitter.service');
const TweetAnalysis = require('../models/TweetAnalysis');

// Get tweets by username
exports.getTweetsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { maxResults = 10 } = req.query;

    const tweets = await twitterService.getUserTweets(username, maxResults);

    res.json({ tweets });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Error fetching tweets' });
  }
};

// Get single tweet by ID
exports.getTweetById = async (req, res) => {
  try {
    const { tweetId } = req.params;

    const tweet = await twitterService.getTweetById(tweetId);

    res.json({ tweet });
  } catch (error) {
    console.error('Error fetching tweet:', error);
    res.status(500).json({ error: 'Error fetching tweet' });
  }
};

// Search tweets
exports.searchTweets = async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const tweets = await twitterService.searchTweets(query, maxResults);

    res.json({ tweets });
  } catch (error) {
    console.error('Error searching tweets:', error);
    res.status(500).json({ error: 'Error searching tweets' });
  }
};

// Get my tweets (using connected Twitter account or stored username)
exports.getMyTweets = async (req, res) => {
  try {
    const user = req.user;

    if (!user.twitterUsername) {
      return res.status(400).json({
        error: 'Please set your Twitter username first',
      });
    }

    const tweets = await twitterService.getUserTweets(
      user.twitterUsername,
      req.query.maxResults || 10
    );

    res.json({ tweets });
  } catch (error) {
    console.error('Error fetching my tweets:', error);
    res.status(500).json({ error: 'Error fetching tweets' });
  }
};

// Get saved tweet analyses
exports.getSavedAnalyses = async (req, res) => {
  try {
    const analyses = await TweetAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Error fetching saved analyses' });
  }
};
