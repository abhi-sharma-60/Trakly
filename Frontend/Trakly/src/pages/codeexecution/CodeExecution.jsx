import React from 'react';
import CodeEditor from '../../components/CodeEditor';
import RecommendedProblems from '../../components/RecommendedProblems';

function CodeExecution() {
  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Middle Editor Section */}
      <CodeEditor />

      {/* Right Sidebar Suggestions */}
      <RecommendedProblems />
    </div>
  );
}

export default CodeExecution;