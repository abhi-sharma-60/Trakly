// src/components/StatCard.js
import React from 'react';

function StatCard({ title, value, subtext }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h4 className="text-sm font-medium text-gray-500 mb-4">{title}</h4>
      <div className="flex flex-col items-center justify-center h-40">
        <p className="text-6xl font-extrabold text-indigo-600 mb-2">{value}</p>
        <p className="text-sm text-gray-500">{subtext}</p>
      </div>
    </div>
  );
}

export default StatCard;