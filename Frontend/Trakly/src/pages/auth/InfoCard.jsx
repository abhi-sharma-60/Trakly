import React from 'react';

// ✅ ENV VARIABLE (ADDED — nothing removed)
const APP_NAME = import.meta.env.VITE_APP_NAME;

// Reusable component for a single feature item
const FeatureItem = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    {/* Icon Container */}
    <div className="flex-shrink-0 text-3xl text-indigo-600 mt-1">
      {icon}
    </div>

    {/* Text Content */}
    <div>
      <h4 className="text-xl font-bold text-gray-900 mb-1">
        {title}
      </h4>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

function InfoCard() {
  // Define the data for the features
  const features = [
    {
      icon: '📊',
      title: 'Personalized Analytics',
      description:
        'Gain deep insights into your performance, track progress, and identify weak topics with AI-powered analysis.',
    },
    {
      icon: '👥',
      title: 'Profile Aggregation & Sync',
      description:
        'Connect and synchronize your LeetCode and Codeforces profiles in one unified dashboard.',
    },
    {
      icon: '💻',
      title: 'Integrated Code Sandbox',
      description:
        'Practice problems in a robust editor with multi-language support and real-time execution.',
    },
  ];

  return (
    // Outer container for the entire card
    <div className="bg-blue-50 p-10 rounded-xl ring shadow-2xl 
                    w-[580px] font-sans flex flex-col">

      {/* Title Section */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
        Why {APP_NAME}?
      </h2>

      <p className="text-lg text-gray-600 mb-10">
        Unlock your full potential in competitive programming with these powerful features.
      </p>

      {/* Features List */}
      <div className="space-y-10 flex-grow">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

    </div>
  );
}

export default InfoCard;
