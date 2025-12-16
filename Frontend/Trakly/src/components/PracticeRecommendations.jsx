// src/components/PracticeRecommendations.js
import React, { useState } from 'react';

const recommendations = [
  { title: 'Two Sum', type: 'Most Liked' },
  { title: 'Longest Substring Without Repeating Characters', type: 'High Value' },
  { title: 'Median of Two Sorted Arrays', type: 'High Value' },
  { title: 'Valid Parentheses', type: 'Most Liked' },
];

function PracticeRecommendations() {
  const [activeTab, setActiveTab] = useState('Most Liked');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Practice Recommendations</h3>
      <p className="text-sm text-gray-500 mb-6">Suggested problems to improve your skills.</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {['Most Liked', 'High Value'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div className="flex-grow space-y-2">
        {recommendations
          .filter(r => r.type === activeTab)
          .map((problem, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="text-base text-gray-700">{problem.title}</span>
              <span className="text-lg text-gray-500">⌄</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PracticeRecommendations;