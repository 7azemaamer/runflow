"use client";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  IoAdd as Plus,
  IoGitNetworkOutline as Workflow,
  IoTrashOutline as Trash2,
  IoEyeOutline as Eye,
  IoSparklesOutline as Sparkles,
} from "react-icons/io5";
import Swal from "sweetalert2";

export default function WorkflowsPage(): JSX.Element {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const { fetchWorkflows, addWorkflow, workflows, deleteWorkflow } =
    useWorkflowStore();

  const router = useRouter();

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  // Add new workflow
  const handleSubmit = async ({
    name,
    type,
    description,
  }: {
    name: string;
    type: string;
    description: string;
  }) => {
    try {
      await addWorkflow({
        name,
        type,
        description,
        nodes: [],
        edges: [],
      });
      setShowAddPopup(false);
    } catch (err) {
      console.error(err);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      type: "",
    },

    onSubmit: handleSubmit,
  });

  // delete popup
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white rounded-md px-2 py-1 mx-1",
      cancelButton: "bg-red-500 text-white rounded-md px-2 py-1",
    },
    buttonsStyling: false,
  });

  // Delete workflow
  const handleDelete = async (id: string) => {
    try {
      customSwal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await deleteWorkflow(id);
            customSwal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            customSwal.fire({
              title: "Cancelled",
              text: "Your workflow is safe :)",
              icon: "error",
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30">
              <Workflow className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Workflows
            </h1>
          </div>
          <p className="text-slate-400 text-lg ml-14">
            Design, automate, and orchestrate your digital processes
          </p>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Workflow Card */}
          <Card
            className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer border-dashed border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
            onClick={() => setShowAddPopup(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-48 p-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 mb-4 hover:translate-1 transition-transform duration-300">
                <Plus className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
                Create Workflow
              </h3>
              <p className="text-sm text-slate-500 mt-1 text-center">
                Start building something amazing
              </p>
            </CardContent>
          </Card>

          {/* Existing Workflows */}
          {workflows?.map((workflow) => (
            <Card
              key={workflow.id}
              className="group hover:translate-1 transition-all duration-300 cursor-pointer bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {workflow.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 shrink-0"
                  >
                    {workflow.type}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400 line-clamp-3 text-sm">
                  {(workflow?.description as string)
                    ?.split(" ")
                    .slice(0, 15)
                    .join(" ")}
                  {(workflow?.description as string)?.split(" ").length > 15 &&
                    "..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(workflow.id);
                    }}
                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/workflows/${workflow.id}`);
                    }}
                    className="flex-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Create Workflow Dialog */}
      <Dialog open={showAddPopup} onOpenChange={setShowAddPopup}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 backdrop-blur-sm max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Create New Workflow
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-300"
              >
                Workflow Name
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder="Enter workflow name"
                className="bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                required
              />
            </div>

            {/* Type Field */}
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-slate-300"
              >
                Workflow Type
              </label>
              <select
                name="type"
                id="type"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.type}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                required
              >
                <option value="">Select type</option>
                <option value="Messages">Messages</option>
                <option value="Data">Data</option>
                <option value="Email">Email</option>
              </select>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-300"
              >
                Description (Optional)
              </label>
              <Textarea
                name="description"
                placeholder="Describe what this workflow does..."
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                className="bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
