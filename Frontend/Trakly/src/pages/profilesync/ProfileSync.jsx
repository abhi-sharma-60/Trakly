import React, { useState } from 'react';
import PlatformCard from '../../components/Platform';

function ProfileSync() {
  // Mock State for Platforms
  const [platforms, setPlatforms] = useState([
    { id: 1, name: 'LeetCode', icon: '🍎', status: 'Linked', lastSynced: '2023-10-26 10:30 AM' },
    { id: 2, name: 'Codeforces', icon: '🔵', status: 'Not Linked', lastSynced: null },
  ]);

  const handleRemove = async (id) => {
    // Dummy API call for backend reference
    try {
      await fetch('https://dummyjson.com/posts/1', {
        method: 'DELETE',
      });
    } catch (err) {
      console.log('Dummy remove API failed');
    }

    setPlatforms(platforms.map(p => 
      p.id === id ? { ...p, status: 'Not Linked', lastSynced: null } : p
    ));
  };

  const handleAdd = async (id) => {
    // In real app, you'd validate the URL here

    // Dummy API call for backend reference
    try {
      await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platformId: id,
          action: 'LINK_PROFILE',
        }),
      });
    } catch (err) {
      console.log('Dummy add API failed');
    }

    setPlatforms(platforms.map(p => 
      p.id === id ? { ...p, status: 'Linked', lastSynced: 'Just now' } : p
    ));
  };

  const handleUnlinkAll = async () => {
    // Dummy API call for backend reference
    try {
      await fetch('https://dummyjson.com/posts/2', {
        method: 'DELETE',
      });
    } catch (err) {
      console.log('Dummy unlink all API failed');
    }

    setPlatforms(platforms.map(p => ({
      ...p,
      status: 'Not Linked',
      lastSynced: null,
    })));
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
