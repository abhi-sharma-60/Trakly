// src/components/WeakTopics.js
import React from 'react';
import { useSelector } from 'react-redux';

function WeakTopics() {
  // Pull the AI analysis data from Redux
  const analysis = useSelector((state) => state.profile.analysis);

  // Fallback UI for when the user hasn't generated the analysis yet
  if (!analysis || !analysis.practicePlan) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Detected Weak Topics</h3>
        <p className="text-sm text-gray-500">
          No data available. Please click "Generate AI Analysis" on the dashboard to view your insights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Detected Weak Topics</h3>
      <p className="text-sm text-gray-500 mb-6">Based on your AI analysis and submission patterns.</p>

      <div className="space-y-6 flex-grow">
        {analysis.practicePlan.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-1">
              <span className="text-base font-semibold text-gray-800">{item.topic}</span>
              
              {/* Repurposed the "Solve Rate" pill to show the AI's "Recommended Rating" */}
              <span className="text-sm text-red-600 font-medium bg-red-100 px-2 py-0.5 rounded-full">
                Target Rating: {item.recommendedRating}
              </span>
            </div>
            
            {/* Repurposed the "Wrong Submissions" text to a generic status indicator */}
            <p className="text-xs text-red-700 font-medium mb-1">
              Status: <span className="font-bold">Needs Improvement</span>
            </p>
            
            {/* Mapped the AI's "reason" directly to your insight section */}
            <p className="text-sm text-gray-600 italic">
              **AI insight**: {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeakTopics;