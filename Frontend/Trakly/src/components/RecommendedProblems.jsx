import React from 'react';

const problems = [
  { id: 1, title: 'Two Sum', tags: 'Arrays, Hash Table', diff: 'Easy', color: 'bg-green-100 text-green-700' },
  { id: 2, title: 'Longest Substring Without Repeating Characters', tags: 'Hash Table, String, Sliding Window', diff: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { id: 3, title: 'Median of Two Sorted Arrays', tags: 'Array, Binary Search, Divide and Conquer', diff: 'Hard', color: 'bg-red-100 text-red-700' },
  { id: 4, title: 'Container With Most Water', tags: 'Array, Two Pointers', diff: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
];

function RecommendedProblems() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Recommended Problems</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="text-xl">≡</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {problems.map((prob) => (
          <div key={prob.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight">
                {prob.title}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${prob.color}`}>
                {prob.diff}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">{prob.tags}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <span>⚙️</span>
          <span>Configure Sandbox Limits</span>
        </button>
      </div>
    </div>
  );
}

export default RecommendedProblems;