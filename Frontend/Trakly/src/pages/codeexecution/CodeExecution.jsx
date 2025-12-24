// src/components/CodeEditor.js
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const [language, setLanguage] = useState('cpp'); // Monaco uses 'cpp' for C++
  
  const defaultCode = {
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello Trakly!" << std::endl;\n    return 0;\n}`,
    python: `print("Hello Trakly!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Trakly!");\n    }\n}`
  };

  const [code, setCode] = useState(defaultCode.cpp);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // Switch to default snippet for that language
    if (newLang === 'cpp') setCode(defaultCode.cpp);
    if (newLang === 'python') setCode(defaultCode.python);
    if (newLang === 'java') setCode(defaultCode.java);
  };

  // ✅ Dummy Run Code handler (ADDED ONLY)
  const handleRunCode = async () => {
    try {
      await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          input: 'sample input',
          action: 'RUN_CODE'
        }),
      });
    } catch (err) {
      console.log('Dummy run code API failed');
    }
  };

  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Header: Title & Language Selector */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sort an Array (Easy)</h2>
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Monaco Editor Container */}
        <div className="rounded-xl shadow-lg overflow-hidden border border-gray-800 mb-6 bg-[#1e1e1e]">
          <div className="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
            <span className="text-xs text-gray-400 font-mono">
              solution.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'java'}
            </span>
          </div>
          
          <Editor
            height="400px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 }
            }}
          />
        </div>

        {/* Custom Input & Output Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Custom Input</label>
            <textarea 
              className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter test cases..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Output</label>
            <div className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm font-mono text-gray-500">
              Run code to see output
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleRunCode}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2"
          >
            <span>▶</span>
            <span>Run Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
