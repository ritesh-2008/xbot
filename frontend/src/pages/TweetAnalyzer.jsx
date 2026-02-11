import { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  MessageSquare,
  List,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '../services/api';

export default function TweetAnalyzer() {
  const [tweetText, setTweetText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const [results, setResults] = useState(null);

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Sparkles },
    { id: 'leverage', label: 'Leverage Ideas', icon: Lightbulb },
    { id: 'replies', label: 'Reply Suggestions', icon: MessageSquare },
    { id: 'thread', label: 'Expand to Thread', icon: List },
    { id: 'rewrite', label: 'Rewrite', icon: RefreshCw },
  ];

  const handleAnalyze = async () => {
    if (!tweetText.trim()) {
      toast.error('Please enter a tweet to analyze');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      let data;
      switch (activeTab) {
        case 'analyze':
          const analyzeRes = await aiAPI.analyzeTweet({ tweetText });
          data = analyzeRes.data.analysis;
          break;
        case 'leverage':
          const leverageRes = await aiAPI.generateLeverageIdeas(tweetText);
          data = leverageRes.data.ideas;
          break;
        case 'replies':
          const repliesRes = await aiAPI.generateReplySuggestions(tweetText);
          data = repliesRes.data.replies;
          break;
        case 'thread':
          const threadRes = await aiAPI.expandToThread(tweetText, 5);
          data = threadRes.data.thread;
          break;
        case 'rewrite':
          const rewriteRes = await aiAPI.rewriteTweet(tweetText, 'viral');
          data = rewriteRes.data.rewritten;
          break;
        default:
          break;
      }
      setResults(data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    switch (activeTab) {
      case 'analyze':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-x-dark p-4 rounded-lg">
                <h4 className="font-semibold text-x-blue mb-2">Summary</h4>
                <p className="text-gray-300">
                  {results.analysis?.summary || results.summary}
                </p>
              </div>
              <div className="bg-x-dark p-4 rounded-lg">
                <h4 className="font-semibold text-x-blue mb-2">Sentiment</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    (results.analysis?.sentiment || results.sentiment) ===
                    'positive'
                      ? 'bg-green-900 text-green-300'
                      : (results.analysis?.sentiment || results.sentiment) ===
                        'negative'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {results.analysis?.sentiment || results.sentiment}
                </span>
              </div>
            </div>
            <div className="bg-x-dark p-4 rounded-lg">
              <h4 className="font-semibold text-x-blue mb-2">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {(results.analysis?.topics || results.topics)?.map(
                  (topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="bg-x-dark p-4 rounded-lg">
              <h4 className="font-semibold text-x-blue mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {(results.analysis?.suggestions || results.suggestions)?.map(
                  (suggestion, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-x-blue">•</span>
                      {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        );

      case 'leverage':
        return (
          <div className="space-y-4">
            {results.ideas?.map((idea, i) => (
              <div key={i} className="bg-x-dark p-4 rounded-lg">
                <h4 className="font-semibold text-x-blue mb-2">{idea.title}</h4>
                <p className="text-gray-300 mb-3">{idea.description}</p>
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-400 mb-1">
                    Action Steps:
                  </h5>
                  <ul className="space-y-1">
                    {idea.actionSteps?.map((step, j) => (
                      <li key={j} className="text-gray-300 text-sm">
                        {j + 1}. {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-green-400">
                  Expected: {idea.expectedOutcome}
                </p>
              </div>
            ))}
          </div>
        );

      case 'replies':
        return (
          <div className="space-y-3">
            {results.replies?.map((reply, i) => (
              <div key={i} className="bg-x-dark p-4 rounded-lg">
                <p className="text-gray-200 mb-2">"{reply.text}"</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-900 text-purple-300 rounded">
                    {reply.style}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      reply.engagement_potential === 'high'
                        ? 'bg-green-900 text-green-300'
                        : reply.engagement_potential === 'medium'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {reply.engagement_potential} engagement
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'thread':
        return (
          <div className="space-y-3">
            {results.thread?.map((tweet, i) => (
              <div
                key={i}
                className="bg-x-dark p-4 rounded-lg border-l-4 border-x-blue"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-x-blue font-bold">{tweet.number}.</span>
                  {tweet.hook && (
                    <span className="text-xs px-2 py-1 bg-yellow-900 text-yellow-300 rounded">
                      Hook
                    </span>
                  )}
                </div>
                <p className="text-gray-200">{tweet.text}</p>
              </div>
            ))}
            {results.callToAction && (
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-800">
                <p className="text-green-300 font-medium">
                  CTA: {results.callToAction}
                </p>
              </div>
            )}
          </div>
        );

      case 'rewrite':
        return (
          <div className="space-y-3">
            {results.variations?.map((variation, i) => (
              <div key={i} className="bg-x-dark p-4 rounded-lg">
                <p className="text-gray-200 mb-2">"{variation.text}"</p>
                <p className="text-sm text-green-400">
                  ✨ {variation.improvement}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tweet Analyzer</h1>
        <p className="text-gray-400">
          Paste any tweet and let AI help you leverage it
        </p>
      </div>

      {/* Input Area */}
      <div className="card">
        <textarea
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          className="input-field min-h-[120px] resize-none"
          placeholder="Paste a tweet here to analyze..."
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">
            {tweetText.length}/500 characters
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setResults(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === tab.id
                ? 'bg-x-blue text-white'
                : 'bg-x-darker text-gray-400 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !tweetText.trim()}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {tabs.find((t) => t.id === activeTab)?.label}
          </>
        )}
      </button>

      {/* Results */}
      {results && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          {renderResults()}
        </div>
      )}
    </div>
  );
}
