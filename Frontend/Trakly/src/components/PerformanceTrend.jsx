// src/components/PerformanceTrend.js
import React from 'react';

function PerformanceTrend() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
      <h4 className="text-sm font-medium text-gray-500 mb-4">Performance Trend (Problems Solved)</h4>
      
      {/* Mock Line Graph Area - Placeholder for a charting library */}
      <div className="h-64 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 text-gray-400 rounded-lg">
        [Actual Line Chart Component (e.g., Recharts) would go here]
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 pt-2">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
}

export default PerformanceTrend;