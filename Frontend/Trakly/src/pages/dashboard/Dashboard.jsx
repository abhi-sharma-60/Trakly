// src/layouts/Dashboard.js
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';

// ✅ ENV VARIABLE (ADDED — nothing removed)
const APP_NAME = import.meta.env.VITE_APP_NAME;

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header (Top Bar) */}
        <Header />
        
        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <AnalyticsDashboard />
        </main>
        
        {/* Footer (Mock, as seen in the screenshot) */}
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

// To run the application, ensure this component is rendered in your main App.js file:
// // App.js
// import Dashboard from './layouts/Dashboard';
// const App = () => <Dashboard />;
// export default App;
