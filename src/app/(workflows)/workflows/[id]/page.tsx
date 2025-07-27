"use client";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  Edge,
  Node,
  NodeChange,
  addEdge,
  Connection,
  Background,
  Controls,
} from "@xyflow/react";
import { useState, useCallback } from "react";
import "@xyflow/react/dist/style.css";
import { useParams } from "next/navigation";
import { JSX, useEffect } from "react";
import CustomNode from "@/components/nodes/customNode";
import Image from "next/image";
import Link from "next/link";

const nodeTypes = {
  custom: CustomNode,
};
export default function WorkflowEditor(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { fetchWorkflowById, selectedWorkflow } = useWorkflowStore();

  useEffect(() => {
    const load = async () => {
      await fetchWorkflowById(id);
    };
    load();
  }, [id, fetchWorkflowById]);

  // Sync state when workflow changes
  useEffect(() => {
    if (selectedWorkflow) {
      setNodes(selectedWorkflow.nodes || []);
      setEdges(selectedWorkflow.edges || []);
    }
  }, [selectedWorkflow]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((prev) => applyNodeChanges(changes, prev ?? [])),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((prev) => applyEdgeChanges(changes, prev ?? [])),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot ?? [])),
    []
  );

  if (!selectedWorkflow) {
    return <p className="text-slate-400">Loading workflow...</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          {/* Left - Back button */}
          <div className="rounded-full bg-teal-400 p-2 cursor-pointer">
            <Link href={"/workflows"}>
              <Image
                src={"/icons/back.svg"}
                width={40}
                height={40}
                alt="Back to workflows"
              />
            </Link>
          </div>
          <div>
            <h1 className="text-3xl text-teal-400 font-bold">
              {selectedWorkflow?.name}
            </h1>
            <p className="text-justify mt-1">{selectedWorkflow?.description}</p>
          </div>
          {/* Right - Workflow type */}
          <div className="rounded-xl bg-teal-400 text-black p-1 px-4 font-bold">
            {selectedWorkflow?.type}
          </div>
        </div>

        <div className="border border-slate-400"></div>
      </div>
      {/* React flow component */}
      <div className="grid grid-cols-12">
        {selectedWorkflow.nodes.length !== 0 ? (
          <div className="col-span-10 text-slate-400 h-[80vh] w-[100%] p-4">
            <ReactFlow
              key={id}
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              defaultEdgeOptions={{
                style: { stroke: "#38bdf8", strokeWidth: 2 },
                labelStyle: { fill: "#fff", fontSize: 12 },
                labelBgStyle: { fill: "#333" },
                labelBgPadding: [4, 2],
                labelBgBorderRadius: 4,
              }}
              fitView
            >
              <Background color="#069494" style={{ zIndex: -1 }} />
              <Controls />
            </ReactFlow>
          </div>
        ) : (
          <></>
        )}
        <div
          className={`${
            selectedWorkflow.nodes.length === 0 ? "col-span-12" : "col-span-2"
          } bg-teal-400 text-white`}
        >
          This is where i will add node dashboard
        </div>
      </div>
    </>
  );
}
