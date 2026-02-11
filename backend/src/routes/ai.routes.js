const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All AI routes require authentication
router.use(authMiddleware);

// Analyze a tweet
router.post('/analyze', aiController.analyzeTweet);

// Generate leverage ideas
router.post('/leverage-ideas', aiController.generateLeverageIdeas);

// Generate reply suggestions
router.post('/reply-suggestions', aiController.generateReplySuggestions);

// Expand tweet to thread
router.post('/expand-thread', aiController.expandToThread);

// Rewrite tweet in different styles
router.post('/rewrite', aiController.rewriteTweet);

module.exports = router;
