"use client";
import { useState } from "react";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await fetch("/api/feedback", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ message, email }) 
      });
      setSubmitted(true);
      setMessage("");
      setEmail("");
    } catch (error) {
      console.error("Failed to send feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your feedback has been received. We read every message and use your input to make ATLVeg better for everyone.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          💬 Share Your Feedback
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Help us improve ATLVeg! Tell us what you love, what needs work, or suggest new features.
        </p>
      </div>

      {/* Feedback Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Your Message *
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="Tell us what you think! Suggestions, bugs, feature requests - we want to hear it all..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              required
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {message.length}/500 characters
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Email Address (Optional)
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com - if you'd like us to follow up"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              "Send Feedback"
            )}
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            🌱 Feature Requests
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Got an idea for a new feature? Want to see support for more cities? Let us know what would make ATLVeg even better!
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🐛 Bug Reports
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Found something that's not working right? Describe what happened and we'll investigate and fix it quickly.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          We typically respond to feedback within 24-48 hours. 
          Your input helps us make ATLVeg the best veg-friendly restaurant discovery platform!
        </p>
      </div>
    </div>
  );
}
