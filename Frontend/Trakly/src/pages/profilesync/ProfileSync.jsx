import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlatformCard from '../../components/Platform';

// Import your Redux actions
import { 
  setLeetcodeHandle, 
  setCodeforcesHandle, 
  setInitialSyncData 
} from '../../redux/profileSlice';

// Make sure to define your backend URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function ProfileSync() {
  const dispatch = useDispatch();
  
  // Extract handles and data directly from Redux state
  const { 
    leetcodeHandle, 
    codeforcesHandle, 
    leetcodeData, 
    codeforcesData 
  } = useSelector((state) => state.profile);

  // Derive the platforms array dynamically from Redux
  const platforms = [
    { 
      id: 1, 
      name: 'LeetCode', 
      icon: '🍎', 
      status: (leetcodeHandle || leetcodeData) ? 'Linked' : 'Not Linked', 
      lastSynced: leetcodeData ? 'Synced' : null,
      handle: leetcodeHandle || leetcodeData?.username || null
    },
    { 
      id: 2, 
      name: 'Codeforces', 
      icon: '🔵', 
      status: (codeforcesHandle || codeforcesData) ? 'Linked' : 'Not Linked', 
      lastSynced: codeforcesData ? 'Synced' : null,
      handle: codeforcesHandle || codeforcesData?.username || null
    },
  ];

  const handleRemove = async (id) => {
    // Dummy API call for backend reference
    try {
      await fetch('https://dummyjson.com/posts/1', {
        method: 'DELETE',
      });
      // Here you would eventually dispatch actions to clear the Redux state
      // e.g., dispatch(clearLeetcodeData())
    } catch (err) {
      console.log('Dummy remove API failed');
    }
  };

  const handleAdd = async (id, providedHandle) => {
    const platformToLink = platforms.find(p => p.id === id);

    // --- LEETCODE LINKING & SYNC LOGIC ---
    if (platformToLink.name === 'LeetCode') {
      const handle = providedHandle || window.prompt("Please enter your LeetCode handle:");
      if (!handle) return; 

      try {
        // 1. Link the account
        const linkResponse = await fetch(`${BACKEND_URL}/link-leetcode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', 
          body: JSON.stringify({ handle }),
        });

        if (linkResponse.ok) {
          // Instantly update UI with the handle
          dispatch(setLeetcodeHandle(handle));
          alert("LeetCode account linked successfully! Syncing data...");

          // 2. Make the call to sync LeetCode data
          const syncResponse = await fetch(`${BACKEND_URL}/sync-leetcode`, {
            method: 'GET',
            credentials: 'include',
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            // Store the newly synced data in Redux
            dispatch(setInitialSyncData({ 
              leetcode: syncData.leetcode?.data || syncData.data || syncData 
            }));
          } else {
             alert("Account linked, but failed to sync data immediately.");
          }
        } else {
          const data = await linkResponse.json();
          alert(data.message || "Failed to link LeetCode account.");
        }
      } catch (err) {
        console.error('LeetCode link/sync API failed:', err);
        alert("An error occurred while linking/syncing LeetCode.");
      }
    } 
    
    // --- CODEFORCES LINKING & SYNC LOGIC ---
    else if (platformToLink.name === 'Codeforces') {
      const handle = providedHandle || window.prompt("Please enter your Codeforces handle:");
      if (!handle) return; 

      try {
        // 1. Link the account
        const linkResponse = await fetch(`${BACKEND_URL}/link-codeforces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ handle }),
        });

        if (linkResponse.ok) {
          // Instantly update UI with the handle
          dispatch(setCodeforcesHandle(handle));
          alert("Codeforces account linked! Sync queued in the background...");

          // 2. Make the call to trigger Codeforces sync job
          await fetch(`${BACKEND_URL}/sync-codeforces`, {
            method: 'GET',
            credentials: 'include',
          });
          
          // Note: Redux data update will happen via the SSE listener on the Dashboard once the worker finishes.
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
    // Dummy API call for backend reference
    try {
      await fetch('https://dummyjson.com/posts/2', {
        method: 'DELETE',
      });
      // Eventual Redux reset here
    } catch (err) {
      console.log('Dummy unlink all API failed');
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
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