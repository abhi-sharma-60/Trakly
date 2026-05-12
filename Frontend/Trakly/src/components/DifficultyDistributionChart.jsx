import React from 'react';
import { useSelector } from 'react-redux';

function DifficultyDistributionChart() {
  // Pull LeetCode data from Redux
  const { leetcodeData } = useSelector((state) => state.profile);

  // Extract difficulty stats based on backend mapping
  const easyCount = leetcodeData?.topicStats?.Array || 0;
  const mediumCount = leetcodeData?.topicStats?.DP || 0;
  const hardCount = leetcodeData?.topicStats?.Graph || 0;

  const total = easyCount + mediumCount + hardCount;

  // Helper to safely calculate formatted percentages for the legend
  const getPercentageString = (count) => {
    if (total === 0) return '0%';
    return `${Math.round((count / total) * 100)}%`;
  };

  // Calculate raw percentage numbers for the CSS gradient slices
  const easyPct = total === 0 ? 0 : (easyCount / total) * 100;
  const mediumPct = total === 0 ? 0 : (mediumCount / total) * 100;
  
  // Dynamic CSS for the Donut Chart using conic-gradient
  // Maps to Tailwind colors: green-500 (#22c55e), yellow-500 (#eab308), red-500 (#ef4444)
  const chartStyle = {
    background: total > 0 
      ? `conic-gradient(
          #22c55e 0% ${easyPct}%, 
          #eab308 ${easyPct}% ${easyPct + mediumPct}%, 
          #ef4444 ${easyPct + mediumPct}% 100%
        )`
      : '#e5e7eb', // Fallback to gray-200 if no data
  };

  const difficulties = [
    { label: 'Easy', color: 'bg-green-500', count: easyCount, percentage: getPercentageString(easyCount) },
    { label: 'Medium', color: 'bg-yellow-500', count: mediumCount, percentage: getPercentageString(mediumCount) },
    { label: 'Hard', color: 'bg-red-500', count: hardCount, percentage: getPercentageString(hardCount) },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h4 className="text-sm font-medium text-gray-500 mb-6">Difficulty Distribution</h4>
      
      <div className="flex flex-col items-center">
        
        {/* Colorful Dynamic Donut Chart */}
        <div 
          className="w-36 h-36 rounded-full relative mb-6 shadow-sm" 
          style={chartStyle}
        >
          {/* Inner White Circle (Creates the "Hole" of the Donut) */}
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">
              {total > 0 ? `${total} Solved` : 'No Data'}
            </span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 text-sm">
          {difficulties.map((d) => (
            <div key={d.label} className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <span className={`w-3 h-3 ${d.color} rounded-full`}></span>
                <span className="text-gray-600">{d.label}</span>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {d.count} ({d.percentage})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DifficultyDistributionChart;