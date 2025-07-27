import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

const apiUrl = `http://localhost:4000`;
type Workflow = {
  id: string;
  name: string;
  description?: string;
  type: string;
  nodes: Node[];
  edges: Edge[];
};

type WorkflowState = {
  workflows: Workflow[];
  selectedWorkflow: Workflow | null;

  fetchWorkflows: () => Promise<void>;
  addWorkflow: (workflow: Omit<Workflow, "id">) => Promise<void>;
  fetchWorkflowById: (id: string) => Promise<void>;
  updateWorkflow: (id: string, updated: Partial<Workflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
};
export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  selectedWorkflow: null,

  fetchWorkflows: async () => {
    const res = await fetch(`${apiUrl}/workflows`);
    const data = await res.json();
    set({ workflows: data });
  },
  fetchWorkflowById: async (id: string) => {
    const res = await fetch(`${apiUrl}/workflows/${id}`);
    const data = await res.json();
    set({ selectedWorkflow: data });
  },

  addWorkflow: async (workflow) => {
    const res = await fetch(`${apiUrl}/workflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workflow),
    });
    const newWorkflow = await res.json();
    set({ workflows: [...get().workflows, newWorkflow] });
  },

  updateWorkflow: async (id, updated) => {
    await fetch(`${apiUrl}/workflows/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const workflows = get().workflows.map((wf) =>
      wf.id === id ? { ...wf, ...updated } : wf
    );
    set({ workflows });
  },

  deleteWorkflow: async (id) => {
    await fetch(`${apiUrl}/workflows/${id}`, {
      method: "DELETE",
    });
    set({
      workflows: get().workflows.filter((wf) => wf.id !== id),
    });
  },
}));
