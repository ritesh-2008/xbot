import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Use environment variable for API URL, fallback to /api for development with proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateTwitterUsername: (twitterUsername) =>
    api.patch('/auth/twitter-username', { twitterUsername }),
};

// Tweet API
export const tweetAPI = {
  getTweetsByUsername: (username, maxResults = 10) =>
    api.get(`/tweets/user/${username}`, { params: { maxResults } }),
  getTweetById: (tweetId) => api.get(`/tweets/tweet/${tweetId}`),
  searchTweets: (query, maxResults = 10) =>
    api.get('/tweets/search', { params: { query, maxResults } }),
  getMyTweets: (maxResults = 10) =>
    api.get('/tweets/my-tweets', { params: { maxResults } }),
  getSavedAnalyses: () => api.get('/tweets/analyses'),
};

// AI API
export const aiAPI = {
  analyzeTweet: (data) => api.post('/ai/analyze', data),
  generateLeverageIdeas: (tweetText, context) =>
    api.post('/ai/leverage-ideas', { tweetText, context }),
  generateReplySuggestions: (tweetText, tone) =>
    api.post('/ai/reply-suggestions', { tweetText, tone }),
  expandToThread: (tweetText, numberOfTweets) =>
    api.post('/ai/expand-thread', { tweetText, numberOfTweets }),
  rewriteTweet: (tweetText, style) =>
    api.post('/ai/rewrite', { tweetText, style }),
};

export default api;
