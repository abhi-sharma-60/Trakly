import React from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

/*
  Dummy graph data
  In future, backend / AI will provide nodes & edges
*/
const dummyNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 150, y: 100 }, data: { label: "2" } },
  { id: "3", position: { x: 300, y: 0 }, data: { label: "3" } },
];

const dummyEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

function GraphVisualizerModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="relative w-[90%] h-[90%] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
        >
          ✕
        </button>

        {/* React Flow Canvas */}
        <ReactFlow nodes={dummyNodes} edges={dummyEdges} fitView />
      </div>
    </div>
  );
}

export default GraphVisualizerModal;
