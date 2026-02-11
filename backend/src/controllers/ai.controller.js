const aiService = require('../services/ai.service');
const twitterService = require('../services/twitter.service');
const TweetAnalysis = require('../models/TweetAnalysis');

// Analyze a single tweet
exports.analyzeTweet = async (req, res) => {
  try {
    const { tweetId, tweetText, tweetAuthor } = req.body;

    let text = tweetText;
    let author = tweetAuthor;

    // If only tweetId provided, fetch the tweet
    if (tweetId && !tweetText) {
      const tweet = await twitterService.getTweetById(tweetId);
      text = tweet.text;
      author = tweet.author?.username || 'unknown';
    }

    if (!text) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    // Get AI analysis
    const analysis = await aiService.analyzeTweet(text);

    // Save analysis to database
    const savedAnalysis = new TweetAnalysis({
      userId: req.user._id,
      tweetId: tweetId || `manual-${Date.now()}`,
      tweetText: text,
      tweetAuthor: author || 'manual',
      analysis,
    });
    await savedAnalysis.save();

    res.json({ analysis: savedAnalysis });
  } catch (error) {
    console.error('Error analyzing tweet:', error);
    res.status(500).json({ error: 'Error analyzing tweet' });
  }
};

// Generate leverage ideas for a tweet
exports.generateLeverageIdeas = async (req, res) => {
  try {
    const { tweetText, context } = req.body;

    if (!tweetText) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    const ideas = await aiService.generateLeverageIdeas(tweetText, context);

    res.json({ ideas });
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({ error: 'Error generating leverage ideas' });
  }
};

// Generate reply suggestions
exports.generateReplySuggestions = async (req, res) => {
  try {
    const { tweetText, tone = 'professional' } = req.body;

    if (!tweetText) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    const replies = await aiService.generateReplySuggestions(tweetText, tone);

    res.json({ replies });
  } catch (error) {
    console.error('Error generating replies:', error);
    res.status(500).json({ error: 'Error generating reply suggestions' });
  }
};

// Generate a tweet thread from a single tweet
exports.expandToThread = async (req, res) => {
  try {
    const { tweetText, numberOfTweets = 5 } = req.body;

    if (!tweetText) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    const thread = await aiService.expandToThread(tweetText, numberOfTweets);

    res.json({ thread });
  } catch (error) {
    console.error('Error expanding to thread:', error);
    res.status(500).json({ error: 'Error generating thread' });
  }
};

// Rewrite tweet in different styles
exports.rewriteTweet = async (req, res) => {
  try {
    const { tweetText, style = 'engaging' } = req.body;

    if (!tweetText) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    const rewritten = await aiService.rewriteTweet(tweetText, style);

    res.json({ rewritten });
  } catch (error) {
    console.error('Error rewriting tweet:', error);
    res.status(500).json({ error: 'Error rewriting tweet' });
  }
};
