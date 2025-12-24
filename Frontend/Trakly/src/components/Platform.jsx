import React from 'react';

function PlatformCard({ platform, onAdd, onRemove }) {
  const isLinked = platform.status === 'Linked';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Platform Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
          {/* Placeholder for Platform Logo */}
          <span className="text-xl">{platform.icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{platform.name}</h3>
          {isLinked && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
              Linked
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-grow">
        {isLinked ? (
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Last synced</p>
            <p className="text-sm text-gray-700">{platform.lastSynced}</p>
          </div>
        ) : (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter profile URL"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* Action Button */}
      {isLinked ? (
        <button
          onClick={() => onRemove(platform.id)}
          className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={() => onAdd(platform.id)}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          Add
        </button>
      )}
    </div>
  );
}

export default PlatformCard;