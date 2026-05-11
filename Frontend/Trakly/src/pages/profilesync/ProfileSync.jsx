import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlatformCard from '../../components/Platform';

// Import your Redux actions
import { 
  setInitialSyncData,
  setLeetcodeHandle,
  setCodeforcesHandle
} from '../../store/profileSlice.js';

// Make sure to define your backend URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function ProfileSync() {
  const dispatch = useDispatch();
  
  // NEW: Local state for handling the toast notification
  const [toastMessage, setToastMessage] = useState('');
  
  // Extract handles and data directly from Redux state
  const { 
    leetcodeHandle, 
    codeforcesHandle,
    codeforcesData,
    leetcodeData
  } = useSelector((state) => state.profile);

  // Derive the platforms array dynamically from Redux
  const platforms = [
    { 
      id: 1, 
      name: 'LeetCode', 
      icon: '🍎', 
      status: (leetcodeHandle) ? 'Linked' : 'Not Linked', 
      lastSynced: leetcodeData ? 'Synced' : null,
      handle: leetcodeHandle || null
    },
    { 
      id: 2, 
      name: 'Codeforces', 
      icon: '🔵', 
      status: (codeforcesHandle) ? 'Linked' : 'Not Linked', 
      lastSynced: codeforcesData ? 'Synced' : null,
      handle: codeforcesHandle || codeforcesData?.username || null
    },
  ];

  // Helper function to show and auto-hide the toast
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 5000); // Hides after 5 seconds
  };

  const handleRemove = async (id) => {
    try {
      await fetch('https://dummyjson.com/posts/1', {
        method: 'DELETE',
      });
      // Here you would eventually dispatch actions to clear the Redux state
    } catch (err) {
      console.log('Dummy remove API failed');
    }
  };

  const handleAdd = async (id, providedHandle) => {
    const platformToLink = platforms.find(p => p.id === id);

    // 1. STRICT CHECK: Ensure the user typed something in the input box
    if (!providedHandle || providedHandle.trim() === '') {
      alert(`Please input your ${platformToLink.name} handle in the text box before adding.`);
      return; 
    }

    const handle = providedHandle.trim();

    // --- LEETCODE LINKING LOGIC ---
    if (platformToLink.name === 'LeetCode') {
      try {
        const linkResponse = await fetch(`${BACKEND_URL}/link-leetcode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', 
          body: JSON.stringify({ handle }),
        });

        if (linkResponse.ok) {
          // Instantly update UI with the handle
          dispatch(setLeetcodeHandle(handle));
          
          // Show the toast instructing them to use the dashboard sync
          showToast("LeetCode account linked successfully! Please manually sync the platform by clicking the button on the dashboard.");
        } else {
          const data = await linkResponse.json();
          alert(data.message || "Failed to link LeetCode account.");
        }
      } catch (err) {
        console.error('LeetCode link API failed:', err);
        alert("An error occurred while linking LeetCode.");
      }
    } 
    
    // --- CODEFORCES LINKING LOGIC ---
    else if (platformToLink.name === 'Codeforces') {
      try {
        const linkResponse = await fetch(`${BACKEND_URL}/link-codeforces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ handle }),
        });

        if (linkResponse.ok) {
          // Instantly update UI with the handle
          dispatch(setCodeforcesHandle(handle));
          
          // Show the toast instructing them to use the dashboard sync
          showToast("Codeforces account linked successfully! Please manually sync the platform by clicking the button on the dashboard.");
        } else {
          const data = await linkResponse.json();
          alert(data.message || "Failed to link Codeforces account.");
        }
      } catch (err) {
        console.error('Codeforces link API failed:', err);
        alert("An error occurred while linking Codeforces.");
      }
    }
  };

  const handleUnlinkAll = async () => {
    try {
      await fetch('https://dummyjson.com/posts/2', {
        method: 'DELETE',
      });
    } catch (err) {
      console.log('Dummy unlink all API failed');
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen relative">
      {/* Toast Notification UI */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in-up flex items-center">
          <span className="mr-3 text-green-400">✅</span>
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Integrations</h2>
        <p className="text-gray-600 max-w-2xl">
          Manage your connected coding platform profiles here. Link new profiles or remove existing ones to keep your data synced.
        </p>
      </header>

      {/* Bulk Actions */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleUnlinkAll}
            className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <span className="mr-2">ⓧ</span> Unlink all Profiles
          </button>
        </div>
      </section>

      {/* Platforms Grid */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Manage Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map(platform => (
            <PlatformCard 
              key={platform.id} 
              platform={platform} 
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfileSync;