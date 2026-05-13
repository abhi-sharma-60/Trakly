// src/pages/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import ProfileSync from '../profilesync/ProfileSync';
import CodeExecution from '../codeexecution/CodeExecution';

// IMPORT updateLeetcodeData HERE
import { 
  setInitialSyncData, 
  updateCodeforcesData, 
  updateLeetcodeData,  
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

  // --- Analysis Handler ---
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
      
      if (response.ok) {
        // 1. Parse the new data from the backend response
        const lcData = await response.json();
        console.log(response)
        // 2. Extract the actual data payload (handles APIs that wrap in { data: {...} })
        const payloadData = lcData.data ? lcData.data : lcData;
        
        // 3. Update Redux instantly
        dispatch(updateLeetcodeData(payloadData));
        
        showNotification("LeetCode synced successfully!");
      } else {
        showNotification("Failed to sync LeetCode.");
      }
    } catch (error) {
      console.error("LeetCode Sync Error:", error);
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
        showNotification("Codeforces sync queued...");
        // Note: Redux is updated automatically when the SSE listener hears "CF_SYNC_COMPLETED"
      } else {
        showNotification("Failed to queue Codeforces sync.");
      }
    } catch (error) {
      showNotification("Error queuing Codeforces sync.");
    }
  };

  // =========================================================================
  // EFFECT 1: Fetch Initial Data (Guarded by hasInitialized)
  // =========================================================================
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

    // 2. Fetch existing AI Analysis data
    const fetchExistingAnalysis = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/analysis`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.analysis) {
            dispatch(setUserAnalysisData({
              analysis: data.analysis,
              recommendations: data.recommendations || []
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch existing analysis.", error);
      }
    };

    initiateSync();
    fetchExistingAnalysis();
  }, [dispatch]);


  // =========================================================================
  // EFFECT 2: Manage SSE Connection (Un-guarded so it survives Strict Mode)
  // =========================================================================
  useEffect(() => {
    const sse = new EventSource(`${BACKEND_URL}/codeforcesSse`, { withCredentials: true });
    
    sse.addEventListener("CF_SYNC_COMPLETED", async (event) => {
      showNotification("Codeforces sync completed! Updating your profile...");
      try {
        const cfResponse = await fetch(`${BACKEND_URL}/get-codeforces`, { 
          method: 'GET', 
          credentials: 'include' 
        });
        
        if (cfResponse.ok) {
          const cfData = await cfResponse.json();
          const payloadData = cfData.data ? cfData.data : cfData;
          dispatch(updateCodeforcesData(payloadData));
        }
      } catch (err) { 
        console.error("Error fetching updated Codeforces data:", err); 
      }
    });

    sse.onerror = (err) => {
      console.error("SSE Connection Error", err);
      sse.close();
    };

    return () => {
      sse.close();
    };
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