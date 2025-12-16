// src/components/DifficultyDistributionChart.js
import React from 'react';

function DifficultyDistributionChart() {
  // Mock data for the chart legend
  const difficulties = [
    { label: 'Easy', color: 'bg-green-500', percentage: '35%' },
    { label: 'Medium', color: 'bg-yellow-500', percentage: '40%' },
    { label: 'Hard', color: 'bg-red-500', percentage: '25%' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h4 className="text-sm font-medium text-gray-500 mb-6">Difficulty Distribution</h4>
      
      <div className="flex flex-col items-center">
        {/* Mock Donut Chart - Using a div circle as a placeholder */}
        <div className="w-36 h-36 rounded-full border-8 border-gray-200 relative mb-6">
          {/* Actual implementation would use a charting library (Recharts, Chart.js) */}
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-500">
            {/* Can show total solved count again if desired */}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 text-sm">
          {difficulties.map((d) => (
            <div key={d.label} className="flex items-center space-x-1">
              <span className={`w-3 h-3 ${d.color} rounded-full`}></span>
              <span className="text-gray-600">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DifficultyDistributionChart;