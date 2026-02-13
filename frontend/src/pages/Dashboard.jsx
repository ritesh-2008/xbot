import { useState, useEffect } from 'react';
import { Sparkles, History, Clipboard, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { tweetAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const [tweetText, setTweetText] = useState('');
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedAnalyses();
  }, []);

  const loadSavedAnalyses = async () => {
    try {
      const { data } = await tweetAPI.getSavedAnalyses();
      setSavedAnalyses(data.analyses || []);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTweetText(text);
      toast.success('Pasted from clipboard!');
    } catch (error) {
      toast.error('Could not paste from clipboard');
    }
  };

  const handleAnalyze = () => {
    if (!tweetText.trim()) {
      toast.error('Please enter a tweet to analyze');
      return;
    }
    navigate('/analyzer', { state: { tweetText } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.username}! 👋</h1>
        <p className="text-gray-400">
          Paste any tweet and let AI help you leverage it
        </p>
      </div>

      {/* Quick Analyze */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-x-blue" />
          Quick Tweet Analysis
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="input-field min-h-[120px] resize-none pr-12"
              placeholder="Paste a tweet here...&#10;&#10;Example: Just launched my new product! 🚀 After 6 months of hard work, it's finally live. Check it out!"
              maxLength={500}
            />
            <button
              onClick={handlePaste}
              className="absolute top-3 right-3 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {tweetText.length}/500 characters
            </span>
            <button
              onClick={handleAnalyze}
              className="btn-primary flex items-center gap-2"
              disabled={!tweetText.trim()}
            >
              Analyze with AI
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold">Sentiment Analysis</h3>
          <p className="text-sm text-gray-400">Understand the tone and emotion</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">💡</div>
          <h3 className="font-semibold">Leverage Ideas</h3>
          <p className="text-sm text-gray-400">Get actionable content ideas</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">🧵</div>
          <h3 className="font-semibold">Thread Expansion</h3>
          <p className="text-sm text-gray-400">Turn tweets into viral threads</p>
        </div>
      </div>

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
                className="bg-x-dark p-4 rounded-lg border border-gray-800 hover:border-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate('/analyzer', { state: { tweetText: analysis.tweetText } })}
              >
                <p className="text-sm text-gray-300 mb-2">
                  {analysis.tweetText?.substring(0, 100)}
                  {analysis.tweetText?.length > 100 ? '...' : ''}
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
