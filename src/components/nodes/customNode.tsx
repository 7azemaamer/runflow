"use client";
import { Handle, Position } from "@xyflow/react";

interface NodeData {
  label: string;
}

interface CustomNodeProps {
  data: NodeData;
}

export default function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-300 px-4 py-2 rounded-lg shadow-lg border border-cyan-500/30 min-w-[100px] w-full relative backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 hover:shadow-cyan-500/20">
      <Handle
        type="target"
        position={Position.Top}
        style={{
          zIndex: 2,
          background: "#06b6d4",
          border: "2px solid #0891b2",
          width: "9px",
          height: "9px",
        }}
      />
      <div className="text-center font-semibold text-[10px]">{data.label}</div>

      <Handle
        className=""
        type="source"
        position={Position.Bottom}
        style={{
          zIndex: 2,
          background: "#06b6d4",
          border: "2px solid #0891b2",
          width: "9px",
          height: "9px",
        }}
      />
    </div>
  );
}
