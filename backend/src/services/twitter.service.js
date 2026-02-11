const { TwitterApi } = require('twitter-api-v2');

// Initialize Twitter client with Bearer Token (for reading public tweets)
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Read-only client
const readOnlyClient = twitterClient.readOnly;

/**
 * Get tweets by username
 * @param {string} username - Twitter username (without @)
 * @param {number} maxResults - Maximum number of tweets to fetch (5-100)
 */
exports.getUserTweets = async (username, maxResults = 10) => {
  try {
    // First, get the user ID from username
    const user = await readOnlyClient.v2.userByUsername(username, {
      'user.fields': ['id', 'name', 'username', 'profile_image_url', 'description'],
    });

    if (!user.data) {
      throw new Error('User not found');
    }

    // Then get their tweets
    const tweets = await readOnlyClient.v2.userTimeline(user.data.id, {
      max_results: Math.min(Math.max(maxResults, 5), 100),
      'tweet.fields': ['created_at', 'public_metrics', 'text', 'author_id'],
      expansions: ['author_id'],
    });

    return {
      user: user.data,
      tweets: tweets.data?.data || [],
      meta: tweets.data?.meta,
    };
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw error;
  }
};

/**
 * Get a single tweet by ID
 * @param {string} tweetId - The tweet ID
 */
exports.getTweetById = async (tweetId) => {
  try {
    const tweet = await readOnlyClient.v2.singleTweet(tweetId, {
      'tweet.fields': ['created_at', 'public_metrics', 'text', 'author_id'],
      expansions: ['author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
    });

    return {
      ...tweet.data,
      author: tweet.includes?.users?.[0],
    };
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw error;
  }
};

/**
 * Search for tweets
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results (10-100)
 */
exports.searchTweets = async (query, maxResults = 10) => {
  try {
    const tweets = await readOnlyClient.v2.search(query, {
      max_results: Math.min(Math.max(maxResults, 10), 100),
      'tweet.fields': ['created_at', 'public_metrics', 'text', 'author_id'],
      expansions: ['author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
    });

    // Map authors to tweets
    const users = tweets.includes?.users || [];
    const tweetsWithAuthors = (tweets.data?.data || []).map((tweet) => ({
      ...tweet,
      author: users.find((u) => u.id === tweet.author_id),
    }));

    return {
      tweets: tweetsWithAuthors,
      meta: tweets.data?.meta,
    };
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw error;
  }
};

/**
 * Get user info by username
 * @param {string} username - Twitter username
 */
exports.getUserInfo = async (username) => {
  try {
    const user = await readOnlyClient.v2.userByUsername(username, {
      'user.fields': [
        'id',
        'name',
        'username',
        'profile_image_url',
        'description',
        'public_metrics',
        'created_at',
      ],
    });

    return user.data;
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw error;
  }
};
