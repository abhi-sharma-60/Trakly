import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import ProfileSync from '../profilesync/ProfileSync';
import CodeExecution from '../codeexecution/CodeExecution';

// Import your actions (ADDED setCodeforcesHandle here)
import { 
  setInitialSyncData, 
  updateCodeforcesData, 
  setLeetcodeHandle,
  setCodeforcesHandle
} from '../../store/profileSlice.js'; 

// ENV VARIABLES
const APP_NAME = import.meta.env.VITE_APP_NAME;
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [notification, setNotification] = useState("");
  const hasInitialized = useRef(false);
  const dispatch = useDispatch();

  // Helper function to show notifications temporarily
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  // --- Manual Sync Handlers ---
  const handleSyncLeetCode = async () => {
    showNotification("Starting LeetCode sync...");
    try {
      const response = await fetch(`${BACKEND_URL}/sync-leetcode`, {
        method: 'GET', 
        credentials: 'include',
      });
      
      if (response.ok) {
        showNotification("LeetCode synced successfully!");
      } else {
        showNotification("Failed to sync LeetCode.");
      }
    } catch (error) {
      console.error("Error during LeetCode sync:", error);
      showNotification("Error syncing LeetCode.");
    }
  };

  const handleSyncCodeforces = async () => {
    showNotification("Queuing Codeforces sync...");
    try {
      const response = await fetch(`${BACKEND_URL}/sync-codeforces`, {
        method: 'GET', 
        credentials: 'include',
      });
      
      if (response.ok) {
        showNotification("Codeforces sync queued. Waiting for completion...");
      } else {
        showNotification("Failed to queue Codeforces sync.");
      }
    } catch (error) {
      console.error("Error during Codeforces sync:", error);
      showNotification("Error queuing Codeforces sync.");
    }
  };
  // ---------------------------------

  useEffect(() => {
    // Prevent double-execution in React 18 Strict Mode during a single mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initiateSync = async () => {
      // REMOVED THE SESSION STORAGE CHECK HERE

      try {
        const response = await fetch(`${BACKEND_URL}/sync`, {
          method: 'GET',
          credentials: 'include', 
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Initial sync data:", data);
          
          // Dispatch data mapping to the new backend response structure
          dispatch(setInitialSyncData({ 
            leetcode: data.leetcode?.data, 
            codeforces: data.codeforces?.data 
          }));

          // Extract and set the LeetCode handle in Redux
          const extractedLcHandle = data.leetcode?.data?.username || data.leetcode?.data?.handle;
          if (extractedLcHandle) {
            dispatch(setLeetcodeHandle(extractedLcHandle));
          }

          // Extract and set the Codeforces handle in Redux
          const extractedCfHandle = data.codeforces?.data?.username || data.codeforces?.data?.handle;
          if (extractedCfHandle) {
            dispatch(setCodeforcesHandle(extractedCfHandle));
          }
          
          // REMOVED SESSION STORAGE SETTER HERE

          showNotification("LeetCode synced successfully! Codeforces sync in progress...");
        } else {
          console.error("Failed to sync dashboard");
        }
      } catch (error) {
        console.error("Error during initial sync:", error);
      }
    };

    initiateSync();

    // 2. Setup Server-Sent Events (SSE) for Codeforces
    const setupSSE = () => {
      const sse = new EventSource(`${BACKEND_URL}/codeforcesSse`, {
        withCredentials: true,
      });

      sse.addEventListener("connected", (event) => {
        console.log("SSE Connected:", event.data);
      });

      // --- Listen for specific success event ---
      sse.addEventListener("CF_SYNC_COMPLETED", async (event) => {
        const data = JSON.parse(event.data);
        console.log("SSE Sync Completed:", data);
        showNotification("Codeforces sync completed! Fetching latest data...");
        
        try {
          // Fetch the freshly synced Codeforces data using your specific route
          const cfResponse = await fetch(`${BACKEND_URL}/get-codeforces`, {
            method: 'GET',
            credentials: 'include',
          });
          
          if (cfResponse.ok) {
            const cfData = await cfResponse.json();
            console.log("Updated Codeforces Data fetched:", cfData);
            
            // Dispatch the newly fetched data directly to Redux
            dispatch(updateCodeforcesData(cfData));
          }
        } catch (fetchErr) {
          console.error("Failed to fetch updated Codeforces data", fetchErr);
        }
      });

      // --- Listen for specific failure event ---
      sse.addEventListener("CF_SYNC_FAILED", (event) => {
        const data = JSON.parse(event.data);
        console.error("SSE Sync Failed:", data.error);
        showNotification(`Codeforces sync failed: ${data.error}`);
        sse.close(); 
      });

      sse.onerror = (err) => {
        console.error("SSE Error:", err);
        sse.close(); 
      };

      return sse;
    };

    const sseConnection = setupSSE();

    // Cleanup function when the component unmounts
    return () => {
      if (sseConnection) {
        sseConnection.close();
      }
    };
  }, [dispatch]); 

  return (
    <div className="flex h-screen bg-gray-100 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-300">
          {notification}
        </div>
      )}

      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header */}
        <Header />

        {/* Action Bar for Manual Syncs */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex space-x-4 items-center shadow-sm z-10">
          <button 
            onClick={handleSyncLeetCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors duration-200"
          >
            Sync LeetCode
          </button>
          <button 
            onClick={handleSyncCodeforces}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors duration-200"
          >
            Sync Codeforces
          </button>
        </div>
        
        {/* Routed Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="analytics" />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="profile-sync" element={<ProfileSync />} />
            <Route path="code-execution" element={<CodeExecution />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="flex justify-between items-center p-4 bg-white border-t border-gray-200 text-xs text-gray-500">
          <p>© 2025 {APP_NAME}. All rights reserved.</p>
          <div className="space-x-4">
            <a
              href="https://github.com/abhi-sharma-60"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              GitHub
            </a>
            <a
              href="https://www.instagram.com/_abhiisharmaa_/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-sharma-mnnit27/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;