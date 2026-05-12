// src/pages/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import ProfileSync from '../profilesync/ProfileSync';
import CodeExecution from '../codeexecution/CodeExecution';

import { 
  setInitialSyncData, 
  updateCodeforcesData, 
  setLeetcodeHandle,
  setCodeforcesHandle,
  setUserAnalysisData 
} from '../../store/profileSlice.js'; 

const APP_NAME = import.meta.env.VITE_APP_NAME;
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [notification, setNotification] = useState("");
  const hasInitialized = useRef(false);
  const dispatch = useDispatch();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  // --- Analysis Handler (Generates NEW analysis) ---
  const handleGenerateAnalysis = async () => {
    showNotification("Generating AI Analysis... this may take a moment.");
    try {
      const response = await fetch(`${BACKEND_URL}/get-analysis`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setUserAnalysisData({
          analysis: data.analysis,
          recommendations: data.recommendations
        }));
        showNotification("Analysis generated successfully!");
      } else {
        showNotification(data.message || "Failed to generate analysis.");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      showNotification("Error connecting to analysis service.");
    }
  };

  // --- Manual Sync Handlers ---
  const handleSyncLeetCode = async () => {
    showNotification("Starting LeetCode sync...");
    try {
      const response = await fetch(`${BACKEND_URL}/sync-leetcode`, {
        method: 'GET', 
        credentials: 'include',
      });
      if (response.ok) showNotification("LeetCode synced successfully!");
      else showNotification("Failed to sync LeetCode.");
    } catch (error) {
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
      if (response.ok) showNotification("Codeforces sync queued...");
      else showNotification("Failed to queue Codeforces sync.");
    } catch (error) {
      showNotification("Error queuing Codeforces sync.");
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // 1. Fetch initial platform sync data
    const initiateSync = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/sync`, {
          method: 'GET',
          credentials: 'include', 
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setInitialSyncData({ 
            leetcode: data.leetcode?.data, 
            codeforces: data.codeforces?.data 
          }));

          const extractedLcHandle = data.leetcode?.data?.username || data.leetcode?.data?.handle;
          if (extractedLcHandle) dispatch(setLeetcodeHandle(extractedLcHandle));

          const extractedCfHandle = data.codeforces?.data?.username || data.codeforces?.data?.handle;
          if (extractedCfHandle) dispatch(setCodeforcesHandle(extractedCfHandle));
        }
      } catch (error) {
        console.error("Initial sync error:", error);
      }
    };

    // 2. NEW: Fetch existing AI Analysis data
    const fetchExistingAnalysis = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/analysis`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          // Only dispatch if analysis actually exists
          if (data.analysis) {
            dispatch(setUserAnalysisData({
              analysis: data.analysis,
              recommendations: data.recommendations || []
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch existing analysis. User may not have generated one yet.", error);
      }
    };

    // Execute initial fetches
    initiateSync();
    fetchExistingAnalysis();

    // 3. Setup SSE
    const setupSSE = () => {
      const sse = new EventSource(`${BACKEND_URL}/codeforcesSse`, { withCredentials: true });
      sse.addEventListener("CF_SYNC_COMPLETED", async (event) => {
        showNotification("Codeforces sync completed! Fetching latest data...");
        try {
          const cfResponse = await fetch(`${BACKEND_URL}/get-codeforces`, { method: 'GET', credentials: 'include' });
          if (cfResponse.ok) {
            const cfData = await cfResponse.json();
            dispatch(updateCodeforcesData(cfData));
          }
        } catch (err) { console.error(err); }
      });
      sse.onerror = () => sse.close();
      return sse;
    };

    const sseConnection = setupSSE();
    return () => sseConnection?.close();
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {notification && (
        <div className="absolute top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg">
          {notification}
        </div>
      )}

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex space-x-4 items-center shadow-sm z-10">
          <button onClick={handleSyncLeetCode} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-all">
            Sync LeetCode
          </button>
          <button onClick={handleSyncCodeforces} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-all">
            Sync Codeforces
          </button>
          
          <button 
            onClick={handleGenerateAnalysis} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-all"
          >
            Generate AI Analysis
          </button>
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="analytics" />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="profile-sync" element={<ProfileSync />} />
            <Route path="code-execution" element={<CodeExecution />} />
          </Routes>
        </main>
        
        <footer className="flex justify-between items-center p-4 bg-white border-t text-xs text-gray-500">
          <p>© 2025 {APP_NAME}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;