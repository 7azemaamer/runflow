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
  FitViewOptions,
  ConnectionMode,
} from "@xyflow/react";
import { useState, useCallback } from "react";
import "@xyflow/react/dist/style.css";
import { useParams } from "next/navigation";
import { JSX, useEffect } from "react";
import CustomNode from "@/components/nodes/customNode";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  IoArrowBackOutline as ArrowLeft,
  IoAdd as Plus,
  IoSearchOutline as Search,
  IoPlayOutline as Play,
  IoSaveOutline as Save,
  IoSettingsOutline as Settings,
  IoFlashOutline as Zap,
} from "react-icons/io5";
import CustomEdge from "@/components/edges/customEdge";

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  buttonedge: CustomEdge,
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
      setNodes(selectedWorkflow?.nodes || []);
      setEdges(selectedWorkflow?.edges || []);
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

  const fitViewOptions: FitViewOptions = {
    padding: 0.2,
  };

  if (!selectedWorkflow) {
    return (
      <div className="fixed inset-0 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <Zap className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }
  const addNode = () => {
    setNodes([
      ...nodes,
      {
        id: `n${Math.floor(100000 + Math.random() * 900000)}`,
        position: { x: 100, y: 100 },
        data: { label: `Node ${Math.floor(Math.random() * 10)}` },
        type: "custom",
      },
    ]);

    console.log("new nodes are", nodes);
  };
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 rounded-lg">
        <div className="flex items-center justify-between p-4">
          {/* Left - Back button and title */}
          <div className="flex items-center gap-4">
            <Link href="/workflows">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-400" />
              </Button>
            </Link>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {selectedWorkflow?.name}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {selectedWorkflow?.description}
              </p>
            </div>
          </div>

          {/* Center - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40"
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-300 hover:bg-slate-500/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Right - Workflow type */}
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 px-3 py-1">
            {selectedWorkflow?.type}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          {nodes.length !== 0 ? (
            <ReactFlow
              key={id}
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              colorMode="dark"
              fitViewOptions={fitViewOptions}
              defaultEdgeOptions={{
                type: "custom",
              }}
              connectionMode={ConnectionMode.Loose}
              edgeTypes={edgeTypes}
              fitView
              className="bg-gradient-to-br from-slate-950 to-slate-900"
            >
              <Background
                color="#334155"
                size={1}
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                }}
              />
              <Controls
                className="bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm rounded-lg"
                showInteractive={false}
              />
            </ReactFlow>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="p-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 mb-4 inline-block">
                  <Zap className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-slate-500 mb-4">
                  Add your first node to get started
                </p>
                <Button
                  onClick={addNode}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Node
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search nodes..."
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
              />
            </div>

            {/* Add Node Button */}
            <Button
              onClick={addNode}
              className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300"
              variant="ghost"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>

            {/* Node Library */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                Node Library
              </h3>
              <div className="grid gap-2">
                {["Trigger", "Action", "Condition", "Transform"].map(
                  (nodeType) => (
                    <div
                      key={nodeType}
                      className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/30 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-200">
                          <Zap className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
                          {nodeType}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
