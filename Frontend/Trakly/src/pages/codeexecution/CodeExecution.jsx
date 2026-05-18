import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

/*
  NOTE:
  - Visualization is currently DUMMY.
  - In future, problem metadata (tags like Graph / Tree)
    will be provided by AI-based problem suggestion engine.
*/

/* =================================================
   🔹 GLOBAL IN-MEMORY CACHE (IMPORTANT)
   - Prevents reset when component unmounts
   - Clears only on full page refresh
   - FIXED: Code is now cached PER LANGUAGE
================================================== */
let EDITOR_CACHE = {
  language: "cpp",
  codeByLanguage: {
    cpp: "",
    python: "",
    java: "",
  },
  input: "",
};

function CodeEditor() {
  const [language, setLanguage] = useState(EDITOR_CACHE.language);
  const [code, setCode] = useState(
    EDITOR_CACHE.codeByLanguage[EDITOR_CACHE.language]
  );
  const [input, setInput] = useState(EDITOR_CACHE.input);
  const [output, setOutput] = useState("Run code to see output");

  /* =======================
     🔹 VISUALIZATION STATES
     ======================= */

  // Dummy flag for visualization modal
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Dummy problem type (will come from AI later)
  const problemType = "Tree"; // Possible: "Tree", "Graph", null

  // In future (REAL):
  // const problemType = problem?.tags?.includes("Tree") ? "Tree" :
  //                     problem?.tags?.includes("Graph") ? "Graph" : null;

  const isVisualizable = problemType === "Tree" || problemType === "Graph";

  const defaultCode = {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    cout << "Hello Trakly!" << endl;\n    return 0;\n}`,
    python: `print("Hello Trakly!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Trakly!");\n    }\n}`,
  };

  /* =======================
     🔹 INITIAL DEFAULT CODE
     ======================= */
  useEffect(() => {
    if (!EDITOR_CACHE.codeByLanguage[language]) {
      const initCode = defaultCode[language];
      setCode(initCode);
      EDITOR_CACHE.codeByLanguage[language] = initCode;
    }
  }, []);

  /* =======================
     🔹 LANGUAGE SWITCH FIX
     ======================= */
  useEffect(() => {
    const cachedCode = EDITOR_CACHE.codeByLanguage[language];

    if (cachedCode) {
      setCode(cachedCode);
    } else {
      const initCode = defaultCode[language];
      setCode(initCode);
      EDITOR_CACHE.codeByLanguage[language] = initCode;
    }
  }, [language]);

  /* =======================
     🔹 CACHE SYNC (CRITICAL)
     ======================= */
  useEffect(() => {
    EDITOR_CACHE.language = language;
    EDITOR_CACHE.codeByLanguage[language] = code;
    EDITOR_CACHE.input = input;
  }, [language, code, input]);

  const getPistonConfig = () => {
    if (language === "c++")
      return { language: "c++", version: "*", filename: "main.cpp" };
    if (language === "python")
      return { language: "python", version: "*", filename: "main.py" };
    return { language: "java", version: "*", filename: "Main.java" };
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

      if (!res.ok) {
        setOutput(`API Error: ${data.message || res.statusText}`);
        return;
      }

      // FIX 2: Catch Compilation Errors (Crucial for C++ and Java)
      if (data.compile && data.compile.code !== 0) {
        setOutput(`Compilation Error:\n${data.compile.stderr}`);
        return;
      }

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
        {/* ======================
            🔹 TOP CONTROLS
           ====================== */}
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

          {/* 🔹 VISUALIZE BUTTON (DUMMY FOR NOW) */}
          {isVisualizable && (
            <button
              onClick={() => setShowVisualizer(true)}
              className="flex-1 max-w-[200px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              👁 Visualize
            </button>
          )}
        </div>

        {/* ======================
            🔹 MAIN WORKSPACE
           ====================== */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Monaco Editor */}
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
                  height="650px"
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
                      alwaysConsumeMouseWheel: false,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Input / Output */}
          <div className="w-full lg:w-[25%] flex flex-col gap-4">
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

      {/* ======================
          🔹 VISUALIZATION MODAL
         ====================== */}
      {showVisualizer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="relative bg-white w-[90%] h-[90%] rounded-xl shadow-2xl p-6 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowVisualizer(false)}
              className="absolute top-4 right-4 text-xl font-bold hover:text-red-600"
            >
              ❌
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {problemType} Visualization (Dummy)
            </h2>

            <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-500 text-lg">
              {problemType === "Tree"
                ? "🌳 Tree Structure Visualization"
                : "🕸 Graph Structure Visualization"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
