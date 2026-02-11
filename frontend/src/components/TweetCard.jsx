import { useState } from 'react';
import { Heart, Repeat2, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TweetCard({ tweet }) {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    // Navigate to analyzer with tweet text
    navigate('/analyzer', { state: { tweetText: tweet.text } });
  };

  return (
    <div className="bg-x-dark p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
          {tweet.author?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">
              {tweet.author?.name || 'User'}
            </span>
            <span className="text-gray-500 text-sm">
              @{tweet.author?.username || 'unknown'}
            </span>
          </div>
          <p className="text-gray-200 mb-3 whitespace-pre-wrap">{tweet.text}</p>

          {/* Metrics */}
          <div className="flex items-center gap-6 text-gray-500 text-sm mb-3">
            {tweet.public_metrics && (
              <>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {tweet.public_metrics.like_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Repeat2 className="w-4 h-4" />
                  {tweet.public_metrics.retweet_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {tweet.public_metrics.reply_count || 0}
                </span>
              </>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-2 text-x-blue hover:bg-blue-900/30 px-3 py-1.5 rounded-full text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Analyze with AI
          </button>
        </div>
      </div>
    </div>
  );
}
