import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import ProfileSync from '../profilesync/ProfileSync';
import CodeExecution from '../codeexecution/CodeExecution';

// ENV VARIABLES
const APP_NAME = import.meta.env.VITE_APP_NAME;
// Make sure you have your backend URL in your .env file
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [notification, setNotification] = useState("");
  const hasInitialized = useRef(false);

  // Helper function to show notifications temporarily
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  // --- NEW: Manual Sync Handlers ---
  const handleSyncLeetCode = async () => {
    showNotification("Starting LeetCode sync...");
    try {
      // Adjust this endpoint to match your specific LeetCode sync route
      const response = await fetch(`${BACKEND_URL}/sync/leetcode`, {
        method: 'POST', // or GET depending on your backend setup
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
      // Adjust this endpoint to match your specific Codeforces queue route
      const response = await fetch(`${BACKEND_URL}/sync/codeforces`, {
        method: 'POST', // or GET depending on your backend setup
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
    // Prevent double-execution in React 18 Strict Mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // 1. Initial Sync Call
    const initiateSync = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/sync`, {
          method: 'GET',
          credentials: 'include', // Important: Sends cookies to backend
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Initial sync data:", data);
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
      // withCredentials ensures cookies are sent along with the SSE request
      const sse = new EventSource(`${BACKEND_URL}/codeforcesSse`, {
        withCredentials: true,
      });

      // Listen for the initial connection handshake from your backend
      sse.addEventListener("connected", (event) => {
        console.log("SSE Connected:", event.data);
      });

      // Listen for standard messages (You need to trigger this from backend when CF is done)
      sse.onmessage = async (event) => {
        console.log("SSE Message received:", event.data);
        
        // Assuming your backend sends a specific string or JSON when CF sync completes.
        // Adjust this condition based on exactly what your backend sends!
        if (event.data.includes("COMPLETED") || event.data.includes("cf_done")) {
          showNotification("Codeforces sync completed!");
          
          // 3. Fetch the freshly synced Codeforces data
          try {
            // Note: Replace this URL with your actual endpoint to fetch JUST Codeforces data
            const cfResponse = await fetch(`${BACKEND_URL}/platforms/codeforces`, {
              method: 'GET',
              credentials: 'include',
            });
            const cfData = await cfResponse.json();
            console.log("Updated Codeforces Data:", cfData);
            
            // Do something with the cfData here (e.g., store in Redux/Context)

          } catch (fetchErr) {
            console.error("Failed to fetch updated Codeforces data", fetchErr);
          }
        }
      };

      sse.onerror = (err) => {
        console.error("SSE Error:", err);
        sse.close(); // Close on error to prevent infinite reconnection loops if unauthorized
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
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      
      {/* Toast Notification (Doesn't affect existing layout) */}
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

        {/* NEW: Action Bar for Manual Syncs */}
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