import React, { useState } from 'react';

function CodeEditor() {
  const [language, setLanguage] = useState('C++');
  const [code, setCode] = useState(`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> arr(n);
    for (int i = 0; i < n; ++i) {
        std::cin >> arr[i];
    }
    std::sort(arr.begin(), arr.end());
    for (int i = 0; i < n; ++i) {
        std::cout << arr[i] << (i == n - 1 ? "" : " ");
    }
    std::cout << std::endl;
    return 0;
}`);

  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Header: Title & Language Selector */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sort an Array (Easy)</h2>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option>C++</option>
            <option>Python</option>
            <option>Java</option>
            <option>JavaScript</option>
          </select>
        </div>

        {/* Editor Area */}
        <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-gray-800 mb-6">
          <div className="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
            <span className="text-xs text-gray-400 font-mono">main.cpp</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-6 bg-[#1e1e1e] text-gray-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Input & Output Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Custom Input</label>
            <textarea 
              placeholder="Enter input here..."
              defaultValue="5\n3 1 4 1 5"
              className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-sm"
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Output</label>
            <div className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm font-mono text-gray-700 shadow-sm">
              1 1 3 4 5
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-200 flex items-center space-x-2">
            <span>▶</span>
            <span>Run Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;