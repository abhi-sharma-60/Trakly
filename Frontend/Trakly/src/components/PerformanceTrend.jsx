// src/components/PerformanceTrend.js
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {ActivityCalendar} from 'react-activity-calendar';

// Helper function to convert Unix timestamps from the backend to the calendar format
const formatHeatmapData = (heatmapObj) => {
  if (!heatmapObj || Object.keys(heatmapObj).length === 0) return [];

  return Object.entries(heatmapObj).map(([unixStr, count]) => {
    // 1. Convert Unix string (seconds) to JS Date (milliseconds)
    const date = new Date(parseInt(unixStr) * 1000);
    // 2. Format to YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    // 3. Calculate intensity "level" (0 to 4) for the GitHub colors
    let level = 0;
    if (count === 1) level = 1;
    else if (count >= 2 && count <= 3) level = 2;
    else if (count >= 4 && count <= 5) level = 3;
    else if (count >= 6) level = 4;

    return {
      date: dateString,
      count: count,
      level: level
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort chronologically
};

function PerformanceTrend() {
  // 1. Pull the combined heatmap data from Redux
  const { combinedAnalytics } = useSelector((state) => state.profile);

  // 2. Format the data (useMemo ensures we only do this heavy math when the data changes)
  const calendarData = useMemo(() => {
    return formatHeatmapData(combinedAnalytics?.heatmap);
  }, [combinedAnalytics?.heatmap]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2 overflow-hidden">
      <h4 className="text-sm font-medium text-gray-500 mb-4">Combined Coding Activity</h4>
      
      {/* Container for the Heatmap */}
      <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-6 overflow-x-auto w-full">
        
        {calendarData.length === 0 ? (
          <div className="text-gray-400 text-sm py-10">
            No activity data available yet. Link accounts and sync!
          </div>
        ) : (
          <div className="min-w-max">
            <ActivityCalendar 
              data={calendarData} 
              
              // GitHub's classic Green color scheme
              theme={{
                light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
              }}
              
              labels={{
                totalCount: '{{count}} submissions in the last year',
              }}
              
              showWeekdayLabels={true}
              blockSize={14}
              blockMargin={4}
              fontSize={14}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default PerformanceTrend;