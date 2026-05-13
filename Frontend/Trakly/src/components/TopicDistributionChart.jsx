import React from 'react';
import { useSelector } from 'react-redux';

function TopicDistributionChart() {
  // 1. Pull the newly combined analytics data from Redux!
  const { combinedAnalytics } = useSelector((state) => state.profile);

  // 2. Extract topicStats (default to empty object if loading)
  const topicStats = combinedAnalytics?.topicStats || {};

  // 3. Dynamically build the topics array
  const topics = Object.entries(topicStats)
    .map(([name, value]) => ({ name, value }))
    .filter((topic) => topic.value > 0)
    .sort((a, b) => b.value - a.value);

  // 4. Calculate the max value dynamically so the tallest bar is always scaled perfectly
  const maxValue = topics.length > 0 ? Math.max(...topics.map(t => t.value)) : 1;
  
  // Define a slightly taller base height for visual clarity (h-56 = 224px)
  const chartHeightPx = 224; 

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h4 className="text-sm font-medium text-gray-500 mb-6">Combined Topic Distribution</h4>
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-x-auto pb-4">
        
        {/* Changed h-48 to h-56 and added pt-4 to give the top numbers extra room */}
        <div className="flex space-x-6 h-56 items-end p-2 pt-4 border-l border-b border-gray-300 min-w-max">
          
          {topics.length === 0 ? (
            <div className="w-full text-center text-gray-400 text-sm pb-4">
              No topic data available yet
            </div>
          ) : (
            topics.map((topic, index) => {
              // Scaled down to 65% (0.65) of max height instead of 80% to ensure the label fits
              const barHeight = (topic.value / maxValue) * chartHeightPx * 0.65; 
              
              return (
                <div key={index} className="flex flex-col items-center justify-end">
                  
                  {/* Value Label */}
                  <span className="text-xs font-medium text-gray-700 mb-1">
                    {topic.value}
                  </span>

                  {/* Bar */}
                  <div 
                    className="bg-indigo-500 w-8 rounded-t-sm transition-all duration-500"
                    style={{ height: `${barHeight}px` }} 
                  ></div>
                  
                  {/* Label */}
                  <span className="text-xs text-gray-600 mt-1 w-12 text-center truncate" title={topic.name}>
                    {topic.name}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default TopicDistributionChart;