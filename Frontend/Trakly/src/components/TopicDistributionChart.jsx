// src/components/TopicDistributionChart.js
import React from 'react';

function TopicDistributionChart() {
  // Mock data for the bar chart
  const topics = [
    { name: 'Arrays', value: 220 },
    { name: 'Graphs', value: 165 },
    { name: 'Trees', value: 130 },
    { name: 'Strings', value: 100 },
    //... more topics
  ];

  // Define the maximum value to use for scaling the height of the bars
  const maxValue = 220;
  // Define a base height for visual clarity, and the total height of the chart area
  const chartHeightPx = 192; // 48 units * 4 (Tailwind h-48)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h4 className="text-sm font-medium text-gray-500 mb-6">Topic Distribution</h4>
      
      {/* Mock Bar Chart Area */}
      {/* h-48 gives 192px height. We use flex and items-end to anchor bars to the bottom */}
      <div className="flex space-x-6 h-48 items-end p-2 border-l border-b border-gray-300">
        
        {/* Render each topic's bar */}
        {topics.map((topic, index) => {
          // Calculate the height as a percentage of the total chart height, 
          // ensuring a minimum height for visibility if value is very low.
          const barHeight = (topic.value / maxValue) * chartHeightPx * 0.8; // Scale to 80% of max height
          
          return (
            <div key={index} className="flex flex-col items-center justify-end">
              
              {/* Value Label (the correction) */}
              <span className="text-xs font-medium text-gray-700 mb-1">
                {topic.value}
              </span>

              {/* Bar */}
              <div 
                className="bg-indigo-500 w-8 rounded-t-sm transition-all duration-500"
                style={{ height: `${barHeight}px` }} 
              ></div>
              
              {/* Label */}
              <span className="text-xs text-gray-600 mt-1 w-12 text-center truncate">
                {topic.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopicDistributionChart;