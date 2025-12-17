import React from 'react';
// 1. IMPORT THE IMAGE: The exact path in your project must be used for the import.
// Assuming your Logo component is in 'src/components/'
import logoImage from '/../Trakly/src/assets/logo.png'; 

/**
 * Reusable Logo Component for AlgoQuest
 * - Replaces the emoji with the imported image.
 * * @param {string} className - Additional Tailwind classes for the container.
 * @param {string} iconSizeClasses - Tailwind classes for the image size (default: w-6 h-6).
 * @param {string} textSize - Tailwind class for the text size (default: 'text-xl').
 */

// ✅ ENV VARIABLE (ADDED — nothing removed)
const APP_NAME = import.meta.env.VITE_APP_NAME;

function Logo({ 
  className = '', 
  iconSizeClasses = 'w-15 h-15', // Default size for an emoji/small icon
  textSize = 'text-xl' 
}) {
  
  // Base classes for the container
  const baseClasses = `flex items-center space-x-2 ${className}`;
  
  // Text classes
  const textClasses = `${textSize} font-semibold text-gray-800`;

  return (
      
      <img 
        src={logoImage} 
        alt={`${APP_NAME} Logo`}
        // Applying Tailwind classes for sizing (e.g., w-6 h-6 is 24px by 24px)
        className={`flex-shrink-0 object-contain ${iconSizeClasses}`} 
      />
     
  );
}

export default Logo;
