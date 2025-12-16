// src/components/WeakTopics.js
import React from 'react';

const weakTopicsData = [
  {
    topic: 'Dynamic Programming',
    wrongSubmissions: 'High (3.2x avg)',
    solveRate: '45%',
    insight: 'Wrong submissions with memoization techniques and state definition. Often revisits similar problems without improvement.',
  },
  {
    topic: 'Graph Algorithms',
    wrongSubmissions: 'Moderate (1.8x avg)',
    solveRate: '55%',
    insight: 'Confusion between BFS/DFS applications. Difficulty with shortest path algorithms like Dijkstra.',
  },
  {
    topic: 'Bit Manipulation',
    wrongSubmissions: 'Very High (4.5x avg)',
    solveRate: '30%',
    insight: 'Fundamental misunderstanding of bitwise operators and their use cases.',
  },
];

function WeakTopics() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Detected Weak Topics</h3>
      <p className="text-sm text-gray-500 mb-6">Based on your submission patterns and problem difficulty.</p>

      <div className="space-y-6 flex-grow">
        {weakTopicsData.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-1">
              <span className="text-base font-semibold text-gray-800">{item.topic}</span>
              <span className="text-sm text-red-600 font-medium bg-red-100 px-2 py-0.5 rounded-full">
                Solve Rate: {item.solveRate}
              </span>
            </div>
            
            <p className="text-xs text-red-700 font-medium mb-1">
              Wrong Submissions: <span className="font-bold">{item.wrongSubmissions}</span>
            </p>
            
            <p className="text-sm text-gray-600 italic">
              **AI insight**: {item.insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeakTopics;