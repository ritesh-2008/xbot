import { useState, useEffect } from 'react';
import { Search, TrendingUp, Sparkles, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { tweetAPI, authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import TweetCard from '../components/TweetCard';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [tweets, setTweets] = useState([]);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const { user, updateUser } = useAuthStore();

  useEffect(() => {
    loadSavedAnalyses();
    if (user?.twitterUsername) {
      setTwitterUsername(user.twitterUsername);
    }
  }, [user]);

  const loadSavedAnalyses = async () => {
    try {
      const { data } = await tweetAPI.getSavedAnalyses();
      setSavedAnalyses(data.analyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const handleFetchTweets = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a Twitter username');
      return;
    }

    setLoading(true);
    try {
      const { data } = await tweetAPI.getTweetsByUsername(username, 10);
      setTweets(data.tweets.tweets || []);
      toast.success(`Found ${data.tweets.tweets?.length || 0} tweets`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error fetching tweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTwitterUsername = async () => {
    if (!twitterUsername.trim()) {
      toast.error('Please enter your Twitter username');
      return;
    }

    try {
      const { data } = await authAPI.updateTwitterUsername(twitterUsername);
      updateUser(data.user);
      toast.success('Twitter username saved!');
    } catch (error) {
      toast.error('Error saving Twitter username');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">
            Search for tweets and leverage them with AI
          </p>
        </div>
      </div>

      {/* Set Your Twitter Username */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-x-blue" />
          Your Twitter Username
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={twitterUsername}
            onChange={(e) => setTwitterUsername(e.target.value)}
            className="input-field flex-1"
            placeholder="@yourusername (without @)"
          />
          <button
            onClick={handleSaveTwitterUsername}
            className="btn-primary whitespace-nowrap"
          >
            Save
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Set your username to easily fetch your own tweets
        </p>
      </div>

      {/* Search Tweets */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-x-blue" />
          Fetch Tweets by Username
        </h2>
        <form onSubmit={handleFetchTweets} className="flex gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field flex-1"
            placeholder="Enter Twitter username"
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Tweets'}
          </button>
        </form>
      </div>

      {/* Tweets List */}
      {tweets.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-x-blue" />
            Tweets Found ({tweets.length})
          </h2>
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Analyses */}
      {savedAnalyses.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-x-blue" />
            Recent Analyses
          </h2>
          <div className="space-y-3">
            {savedAnalyses.slice(0, 5).map((analysis) => (
              <div
                key={analysis._id}
                className="bg-x-dark p-4 rounded-lg border border-gray-800"
              >
                <p className="text-sm text-gray-300 mb-2">
                  {analysis.tweetText.substring(0, 100)}...
                </p>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      analysis.analysis?.sentiment === 'positive'
                        ? 'bg-green-900 text-green-300'
                        : analysis.analysis?.sentiment === 'negative'
                        ? 'bg-red-900 text-red-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {analysis.analysis?.sentiment || 'N/A'}
                  </span>
                  {analysis.analysis?.topics?.slice(0, 2).map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
