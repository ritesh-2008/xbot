# XBot - AI-Powered Tweet Analyzer

A full-stack application that helps you leverage tweets using AI. Fetch tweets from any Twitter/X user and get AI-powered analysis, suggestions, and content ideas.

## Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 🐦 **Twitter Integration** - Fetch tweets by username using Twitter API v2
- 🤖 **AI-Powered Analysis** - Get insights using OpenAI GPT-4
  - Tweet sentiment analysis
  - Topic extraction
  - Leverage ideas generation
  - Reply suggestions
  - Thread expansion
  - Tweet rewriting in different styles
- 📊 **Save & Track** - Save your analyses for future reference

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Twitter API v2 (`twitter-api-v2`)
- OpenAI API

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios

## Project Structure

```
xbot/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── tweet.controller.js
│   │   │   └── ai.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── TweetAnalysis.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── tweet.routes.js
│   │   │   └── ai.routes.js
│   │   ├── services/
│   │   │   ├── twitter.service.js
│   │   │   └── ai.service.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── TweetCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── TweetAnalyzer.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas account
- Twitter Developer Account (for API access)
- OpenAI API Key

### 1. Get Twitter API Credentials

1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create a new project and app
3. Get your API keys:
   - API Key & Secret
   - Bearer Token
   - Access Token & Secret (for write access)

**Note:** Free tier has limited access. For fetching other users' tweets, you may need a paid tier.

### 2. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and generate an API key

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in your keys
cp .env.example .env

# Edit .env with your actual keys
# - MONGODB_URI
# - JWT_SECRET (any random string)
# - TWITTER_BEARER_TOKEN
# - OPENAI_API_KEY

# Start the server
npm run dev
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/twitter-username` - Update Twitter username

### Tweets
- `GET /api/tweets/user/:username` - Get tweets by username
- `GET /api/tweets/tweet/:tweetId` - Get single tweet
- `GET /api/tweets/search?query=...` - Search tweets
- `GET /api/tweets/my-tweets` - Get your tweets
- `GET /api/tweets/analyses` - Get saved analyses

### AI Analysis
- `POST /api/ai/analyze` - Analyze a tweet
- `POST /api/ai/leverage-ideas` - Generate leverage ideas
- `POST /api/ai/reply-suggestions` - Generate reply suggestions
- `POST /api/ai/expand-thread` - Expand tweet to thread
- `POST /api/ai/rewrite` - Rewrite tweet in different styles

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/xbot
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
OPENAI_API_KEY=your_openai_api_key
```

## How Twitter API Access Works

To see tweets from others:
1. **Public Tweets**: You can fetch any public user's tweets using the Bearer Token
2. **Your Own Tweets**: Same as above, just use your own username
3. **Private Tweets**: Not accessible unless the user authorizes your app (OAuth 2.0 flow)

The free tier of Twitter API v2 allows:
- Reading public tweets
- Limited rate limits (around 500k tweets/month on Basic tier)

For production use, consider upgrading to a paid Twitter API tier.

## License

MIT
