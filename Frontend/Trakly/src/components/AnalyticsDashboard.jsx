// src/pages/AnalyticsDashboard.js
import React from 'react';
import StatCard from '../components/StatCard';
import DifficultyDistributionChart from '../components/DifficultyDistributionChart';
import TopicDistributionChart from '../components/TopicDistributionChart';
import PerformanceTrend from '../components/PerformanceTrend';
import WeakTopics from '../components/WeakTopics';
import PracticeRecommendations from '../components/PracticeRecommendations';

function AnalyticsDashboard() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      
      {/* Page Title and Subtitle */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analytics Dashboard</h2>
      <p className="text-gray-500 mb-8">A comprehensive overview of your competitive programming performance and insights.</p>
      
      {/* Top Row: 3 Columns for Stat & Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        <StatCard 
          title="Total Problems Solved" 
          value="1234" 
          subtext="75% of annual goal achieved" 
        />
        
        <DifficultyDistributionChart />
        
        <TopicDistributionChart />
        
      </div>
      
      {/* Mid Row: Performance Trend (Spans 2 columns) */}
      <div className="mb-6">
        <PerformanceTrend />
      </div>
      
      {/* Bottom Row: Weak Topics and Recommendations (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <WeakTopics />
        
        <PracticeRecommendations />
        
      </div>
    </div>
  );
}

export default AnalyticsDashboard;