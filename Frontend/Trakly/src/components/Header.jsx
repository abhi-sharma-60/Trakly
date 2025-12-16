// src/components/Header.js
import React from 'react';
import Logo from './Logo';

function Header() {
  // Mock state for notification count
  const notificationCount = 3; 
  const userNameInitial = 'A'; // User's name initial for the profile avatar

  return (
    <div className="flex justify-between items-center h-16 bg-white border-b border-gray-200 px-6">
      
      {/* Left Side: Project Name */}
      <div className="flex items-center space-x-2">
         <Logo></Logo>
        {/* You could add a small icon or version number here if needed */}
      </div>

      {/* Right Side: Notifications and Profile */}
      <div className="flex items-center space-x-4">
        
        {/* Notification Icon (Bell) */}
        <button className="text-gray-500 hover:text-gray-700 relative p-1 transition-colors">
          <span className="text-xl">🔔</span>
          {/* Unread count badge */}
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center ring-2 ring-white">
              {notificationCount}
            </span>
          )}
        </button>
        
        {/* Profile Tab / User Avatar */}
        <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
          {/* Avatar/Initial */}
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-semibold text-sm ring-2 ring-indigo-500/50">
            {userNameInitial}
          </div>
          {/* Optional: User Name (if you want to show it) */}
          {/* <span className="hidden sm:inline">User Name</span> */}
        </button>
      </div>
    </div>
  );
}

export default Header;