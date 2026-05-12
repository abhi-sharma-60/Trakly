// src/components/PracticeRecommendations.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function PracticeRecommendations() {
  // 1. Pull the AI recommendations data from Redux
  const recommendations = useSelector((state) => state.profile.recommendations);

  // 2. State for the active tab (using the topic name)
  const [activeTab, setActiveTab] = useState('');

  // 3. Automatically set the first tab as active when data loads
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      setActiveTab(recommendations[0].topic);
    }
  }, [recommendations]);

  // Fallback UI for when the user hasn't generated the analysis yet
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Practice Plan</h3>
        <p className="text-sm text-gray-500">
          No recommendations available yet. Generate your AI analysis to get a custom problem set!
        </p>
      </div>
    );
  }

  // Find the problems array for the currently selected topic tab
  const currentTopicData = recommendations.find((r) => r.topic === activeTab);
  const problemsToDisplay = currentTopicData ? currentTopicData.problems : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Practice Plan</h3>
      <p className="text-sm text-gray-500 mb-6">Targeted problems to improve your weak topics.</p>

      {/* Dynamic Tabs based on AI Topics */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto whitespace-nowrap">
        {recommendations.map((group) => (
          <button
            key={group.topic}
            onClick={() => setActiveTab(group.topic)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === group.topic
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {group.topic}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div className="flex-grow space-y-3 overflow-y-auto pr-2">
        {problemsToDisplay.map((problem, index) => (
          // Changed to an anchor <a> tag so users can click and go directly to the problem
          <a
            key={problem._id || index}
            href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} // Adjust if your DB stores full URLs directly
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 group"
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                {problem.name}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {problem.contestId}{problem.index} • Rating: {problem.rating}
              </span>
            </div>
            
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full group-hover:bg-indigo-100 transition-colors">
              Solve ↗
            </span>
          </a>
        ))}

        {problemsToDisplay.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No problems found for this topic.</p>
        )}
      </div>
    </div>
  );
}

export default PracticeRecommendations;