const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function to call Groq
const callGroq = async (systemPrompt, userPrompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
};

/**
 * Analyze a tweet for sentiment, topics, and insights
 */
exports.analyzeTweet = async (tweetText) => {
  const systemPrompt = 'You are a social media expert and content strategist. Analyze tweets and provide actionable insights. Always respond with valid JSON only, no extra text.';
  
  const userPrompt = `Analyze this tweet and provide insights in JSON format:

Tweet: "${tweetText}"

Respond with this exact JSON structure:
{
  "summary": "Brief summary of what the tweet is about",
  "sentiment": "positive or negative or neutral",
  "topics": ["topic1", "topic2"],
  "keyInsights": ["insight1", "insight2"],
  "suggestions": ["suggestion for improvement 1", "suggestion 2"],
  "leverageIdeas": ["how to leverage this tweet idea 1", "idea 2"]
}`;

  return callGroq(systemPrompt, userPrompt);
};

/**
 * Generate ideas to leverage a tweet
 */
exports.generateLeverageIdeas = async (tweetText, context = '') => {
  const systemPrompt = 'You are a growth hacker and content strategist specializing in Twitter/X. Always respond with valid JSON only.';
  
  const userPrompt = `Given this tweet, generate creative ideas on how to leverage it for growth, engagement, or content creation:

Tweet: "${tweetText}"
${context ? `Additional context: ${context}` : ''}

Respond with this exact JSON structure:
{
  "ideas": [
    {
      "title": "Idea title",
      "description": "Detailed description",
      "actionSteps": ["step1", "step2", "step3"],
      "expectedOutcome": "What you can expect"
    }
  ]
}

Provide 5 actionable ideas.`;

  return callGroq(systemPrompt, userPrompt);
};

/**
 * Generate reply suggestions for a tweet
 */
exports.generateReplySuggestions = async (tweetText, tone = 'professional') => {
  const systemPrompt = 'You are a social media engagement expert. Generate authentic, engaging replies. Always respond with valid JSON only.';
  
  const userPrompt = `Generate 5 engaging reply suggestions for this tweet. Tone: ${tone}

Tweet: "${tweetText}"

Respond with this exact JSON structure:
{
  "replies": [
    {
      "text": "The reply text (max 280 chars)",
      "style": "witty or informative or supportive",
      "engagement_potential": "high or medium or low"
    }
  ]
}`;

  return callGroq(systemPrompt, userPrompt);
};

/**
 * Expand a single tweet into a thread
 */
exports.expandToThread = async (tweetText, numberOfTweets = 5) => {
  const systemPrompt = 'You are a viral content creator specializing in Twitter threads. Create engaging, value-packed threads. Always respond with valid JSON only.';
  
  const userPrompt = `Expand this tweet into a compelling Twitter thread of ${numberOfTweets} tweets:

Original tweet: "${tweetText}"

Respond with this exact JSON structure:
{
  "thread": [
    {
      "number": 1,
      "text": "Tweet text (max 280 chars)",
      "hook": true
    }
  ],
  "callToAction": "Suggested CTA for the end"
}`;

  return callGroq(systemPrompt, userPrompt);
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

  const systemPrompt = 'You are a copywriting expert specializing in social media. Always respond with valid JSON only.';
  
  const userPrompt = `Rewrite this tweet to be ${styleDescription}:

Original: "${tweetText}"

Respond with this exact JSON structure:
{
  "variations": [
    {
      "text": "Rewritten tweet (max 280 chars)",
      "improvement": "What makes this version better"
    }
  ]
}

Provide 3 variations.`;

  return callGroq(systemPrompt, userPrompt);
};
