import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import ProfileSync from '../profilesync/ProfileSync';

// ENV VARIABLE
const APP_NAME = import.meta.env.VITE_APP_NAME;

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header */}
        <Header />
        
        {/* Routed Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="analytics" />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="profile-sync" element={<ProfileSync />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="flex justify-between items-center p-4 bg-white border-t border-gray-200 text-xs text-gray-500">
          <p>© 2025 {APP_NAME}. All rights reserved.</p>
          <div className="space-x-4">
            <a href="https://github.com/abhi-sharma-60" className="hover:text-gray-700">GitHub</a>
            <a href="https://www.instagram.com/_abhiisharmaa_/" className="hover:text-gray-700">Instagram</a>
            <a href="https://www.linkedin.com/in/abhishek-sharma-mnnit27/" className="hover:text-gray-700">LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
