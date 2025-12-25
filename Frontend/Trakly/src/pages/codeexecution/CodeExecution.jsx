import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Run code to see output");

  const defaultCode = {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    cout << "Hello Trakly!" << endl;\n    return 0;\n}`,
    python: `print("Hello Trakly!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Trakly!");\n    }\n}`,
  };

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const getPistonConfig = () => {
    if (language === "cpp")
      return { language: "cpp", version: "10.2.0", filename: "main.cpp" };
    if (language === "python")
      return { language: "python", version: "3.10.0", filename: "main.py" };
    return { language: "java", version: "15.0.2", filename: "Main.java" };
  };

  const handleRunCode = async () => {
    setOutput("Running...");
    const cfg = getPistonConfig();

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: cfg.language,
          version: cfg.version,
          stdin: input,
          files: [{ name: cfg.filename, content: code }],
        }),
      });

      const data = await res.json();
      const stdout = data.run?.stdout || "";
      const stderr = data.run?.stderr || "";
      setOutput(stderr.trim() ? stderr : stdout || "No output");
    } catch {
      setOutput("Execution failed");
    }
  };

  return (
    <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Top Controls: Run Button and Select side-by-side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRunCode}
            className="flex-1 max-w-[200px] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>▶</span>
            <span>Run Code</span>
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-1 max-w-[200px] bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Left Side: Monaco Editor (Approx 85% width) */}
          <div className="w-full lg:w-[80%]">
            <div className="rounded-xl overflow-hidden border border-gray-800 shadow-xl bg-[#1e1e1e] h-full flex flex-col">
              <div className="px-4 py-2 text-xs text-gray-400 bg-[#252526] border-b border-gray-800 flex justify-between items-center">
                <span>
                  solution.
                  {language === "cpp"
                    ? "cpp"
                    : language === "python"
                    ? "py"
                    : "java"}
                </span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest font-bold">
                  Monaco IDE
                </span>
              </div>

              <div className="flex-grow">
                <Editor
                  height="650px" // Adjusted height
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 },
                    scrollbar: {
                      alwaysConsumeMouseWheel: false, // Fixes page scrolling
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Input and Output (Approx 15% width) */}
          <div className="w-full lg:w-[25%] flex flex-col gap-4">
            {/* Custom Input */}
            <div className="flex flex-col flex-1">
              <label className="mb-1.5 text-sm font-bold uppercase text-gray-500 tracking-tight">
                Input
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full flex-grow p-3 rounded-lg border border-gray-300 bg-white font-mono text-[15px] focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm resize-none"
                placeholder="Test cases..."
              />
            </div>

            {/* Output */}
            <div className="flex flex-col flex-1">
              <label className="mb-1.5 text-sm font-bold uppercase text-gray-500 tracking-tight">
                Output
              </label>
              <div className="w-full flex-grow p-3 rounded-lg border border-gray-300 bg-black text-green-400 font-mono text-[15px] overflow-auto shadow-sm whitespace-pre-wrap">
                {output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
