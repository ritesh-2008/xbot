const mongoose = require('mongoose');

const tweetAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tweetId: {
      type: String,
      required: true,
    },
    tweetText: {
      type: String,
      required: true,
    },
    tweetAuthor: {
      type: String,
      required: true,
    },
    analysis: {
      summary: String,
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
      },
      topics: [String],
      suggestions: [String],
      leverageIdeas: [String],
    },
    metrics: {
      likes: Number,
      retweets: Number,
      replies: Number,
      impressions: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TweetAnalysis', tweetAnalysisSchema);
