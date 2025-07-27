"use client";
import { Handle, Position } from "@xyflow/react";

export default function CustomNode({ data }: any) {
  return (
    <div className="bg-slate-400 text-black p-4 rounded shadow-md border border-slate-300 w-[150px] relative">
      <Handle type="target" position={Position.Top} style={{ zIndex: 2 }} />
      <div className="text-center font-semibold">{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ zIndex: 2 }} />
    </div>
  );
}
