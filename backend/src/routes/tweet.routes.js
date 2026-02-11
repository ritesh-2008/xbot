const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweet.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All tweet routes require authentication
router.use(authMiddleware);

// Get tweets by username
router.get('/user/:username', tweetController.getTweetsByUsername);

// Get single tweet by ID
router.get('/tweet/:tweetId', tweetController.getTweetById);

// Search tweets
router.get('/search', tweetController.searchTweets);

// Get my tweets (from connected Twitter account)
router.get('/my-tweets', tweetController.getMyTweets);

// Get saved analyses
router.get('/analyses', tweetController.getSavedAnalyses);

module.exports = router;
