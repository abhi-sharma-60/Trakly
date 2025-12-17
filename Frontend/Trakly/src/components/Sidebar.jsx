// src/components/Sidebar.js
import React, { useState } from 'react';
import Logo from './Logo';

// ✅ ENV VARIABLE (ADDED — nothing removed)
const APP_NAME = import.meta.env.VITE_APP_NAME;

const navItems = [
  { name: 'Dashboard', icon: '🏠', type: 'link', active: true },
  { name: 'Profile & Sync', icon: '👤', type: 'link', active: false },
  { name: 'Code Execution', icon: '<>', type: 'link', active: false },
];

const settingItems = [
  { name: 'Settings', icon: '⚙️', type: 'toggle' }, // Changed type to 'toggle'
  { name: 'Log out', icon: '🚪', type: 'action' },
];

const settingFeatures = [
    { name: 'Configure Coding Profiles', action: () => console.log('Opening profile configuration modal...') },
    { name: 'Only show LeetCode', action: () => console.log('Filtering dashboard to LeetCode data...') },
    { name: 'Only show Codeforces', action: () => console.log('Filtering dashboard to Codeforces data...') },
];

function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // LOGOUT HANDLER (Same as before)
  const handleLogout = (e) => {
    e.preventDefault(); 
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    window.location.href = '/'; 
  };
  
  // Settings Handler
  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  // Feature Click Handler
  const handleFeatureClick = (featureAction) => {
      featureAction(); // Execute the specific action
      // Optionally close the settings menu after an action
      // setIsSettingsOpen(false);
  };

  const renderNavItem = (item) => {
    // If the item is a link (default navigation)
    if (item.type === 'link') {
      return (
        <a
          href={`#${item.name.toLowerCase().replace(/\s/g, '-')}`}
          className={`flex items-center space-x-3 p-3 rounded-lg text-sm transition-colors ${
            item.active
              ? 'bg-indigo-50 text-indigo-700 font-semibold'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.name}</span>
        </a>
      );
    } 
    
    // If the item is the Logout action
    if (item.name === 'Log out') {
      return (
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center space-x-3 p-3 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.name}</span>
        </button>
      );
    }
    
    // If the item is the Settings Toggle (using a button to manage state)
    if (item.name === 'Settings') {
        return (
            <button
                onClick={handleSettingsToggle}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg text-sm transition-colors ${
                  isSettingsOpen
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-grow">{item.name}</span>
                <span className="text-xs">{isSettingsOpen ? '▲' : '▼'}</span>
            </button>
        );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-56 bg-white border-r border-gray-200 h-full p-4">
      
      {/* Logo */}
      <div className="flex items-center space-x-2 py-4 mb-4">
        {/* Adjusted Logo rendering for Trakly */}
        <Logo /> 
        <h1 className='text-3xl font-bold text-blue-500'>{APP_NAME}</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              {renderNavItem(item)}
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings and Log Out Section */}
      <div className="border-t border-gray-200 pt-4 mt-auto">
        <ul className="space-y-1">
          {settingItems.map((item) => (
            <li key={item.name}>
                {renderNavItem(item)}
                
                {/* Nested Settings Dropdown Menu */}
                {item.name === 'Settings' && isSettingsOpen && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4 py-1 bg-gray-50 rounded-r-lg">
                        {settingFeatures.map((feature, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleFeatureClick(feature.action)}
                                    className="w-full text-left text-xs text-gray-700 hover:text-indigo-600 hover:bg-white p-2 rounded-lg transition-colors"
                                >
                                    {feature.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
