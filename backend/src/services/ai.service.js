const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze a tweet for sentiment, topics, and insights
 */
exports.analyzeTweet = async (tweetText) => {
  const prompt = `Analyze this tweet and provide insights in JSON format:

Tweet: "${tweetText}"

Provide analysis in this exact JSON format:
{
  "summary": "Brief summary of what the tweet is about",
  "sentiment": "positive" | "negative" | "neutral",
  "topics": ["topic1", "topic2"],
  "keyInsights": ["insight1", "insight2"],
  "suggestions": ["suggestion for improvement 1", "suggestion 2"],
  "leverageIdeas": ["how to leverage this tweet idea 1", "idea 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a social media expert and content strategist. Analyze tweets and provide actionable insights. Always respond with valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
};

/**
 * Generate ideas to leverage a tweet
 */
exports.generateLeverageIdeas = async (tweetText, context = '') => {
  const prompt = `Given this tweet, generate creative ideas on how to leverage it for growth, engagement, or content creation:

Tweet: "${tweetText}"
${context ? `Additional context: ${context}` : ''}

Provide 5 actionable leverage ideas in JSON format:
{
  "ideas": [
    {
      "title": "Idea title",
      "description": "Detailed description",
      "actionSteps": ["step1", "step2", "step3"],
      "expectedOutcome": "What you can expect"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a growth hacker and content strategist specializing in Twitter/X. Always respond with valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
};

/**
 * Generate reply suggestions for a tweet
 */
exports.generateReplySuggestions = async (tweetText, tone = 'professional') => {
  const prompt = `Generate 5 engaging reply suggestions for this tweet. Tone: ${tone}

Tweet: "${tweetText}"

Provide replies in JSON format:
{
  "replies": [
    {
      "text": "The reply text (max 280 chars)",
      "style": "witty/informative/supportive/etc",
      "engagement_potential": "high/medium/low"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a social media engagement expert. Generate authentic, engaging replies. Always respond with valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
};

/**
 * Expand a single tweet into a thread
 */
exports.expandToThread = async (tweetText, numberOfTweets = 5) => {
  const prompt = `Expand this tweet into a compelling Twitter thread of ${numberOfTweets} tweets:

Original tweet: "${tweetText}"

Create a thread in JSON format:
{
  "thread": [
    {
      "number": 1,
      "text": "Tweet text (max 280 chars)",
      "hook": true/false
    }
  ],
  "callToAction": "Suggested CTA for the end"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a viral content creator specializing in Twitter threads. Create engaging, value-packed threads. Always respond with valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
};

/**
 * Rewrite a tweet in different styles
 */
exports.rewriteTweet = async (tweetText, style = 'engaging') => {
  const styles = {
    engaging: 'more engaging and attention-grabbing',
    professional: 'more professional and polished',
    casual: 'more casual and friendly',
    viral: 'optimized for virality with hooks and curiosity gaps',
    educational: 'more educational and informative',
    storytelling: 'as a mini-story',
  };

  const styleDescription = styles[style] || styles.engaging;

  const prompt = `Rewrite this tweet to be ${styleDescription}:

Original: "${tweetText}"

Provide 3 variations in JSON format:
{
  "variations": [
    {
      "text": "Rewritten tweet (max 280 chars)",
      "improvement": "What makes this version better"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a copywriting expert specializing in social media. Always respond with valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
};
