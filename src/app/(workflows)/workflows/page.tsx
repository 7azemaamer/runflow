"use client";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";

export default function WorkflowsPage(): JSX.Element {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const { fetchWorkflows, addWorkflow, workflows, deleteWorkflow } =
    useWorkflowStore();

  const router = useRouter();

  useEffect(() => {
    fetchWorkflows();
  }, []);

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

  // Delete workflow
  const handleDelete = async (id: string) => {
    try {
      await deleteWorkflow(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div id="workflows_container">
        <div className="heading">
          <h1 className="text-3xl font-bold flex text-teal-500 gap-2">
            <Image
              alt="Folder Icon"
              src="/icons/file.svg"
              width={24}
              height={24}
            />
            Workflows
          </h1>
          <p className="text-slate-400 mt-2">
            Here you can view and manage your saved workflows.
          </p>
        </div>
        <div className="workflow-item border-1 border-slate-400 my-2"></div>
        <div id="workflows" className="mt-4 grid grid-cols-12 gap-4">
          <button
            onClick={() => setShowAddPopup(true)}
            className="workflow-item border border-slate-400 col-span-12 md:col-span-4 lg:col-span-2 p-4 rounded flex flex-col gap-2 cursor-pointer justify-center items-center"
          >
            <Image
              src={"/icons/add.svg"}
              width={100}
              height={100}
              alt="Close Icon"
            />
            <h3>Create Workflow</h3>
          </button>
          {workflows &&
            workflows.map((workflow) => {
              return (
                <>
                  <div className="workflow-item border border-slate-400 col-span-12 md:col-span-4 lg:col-span-2 p-4 rounded flex flex-col gap-2 cursor-pointer">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold">{workflow.name}</h3>
                      <p className="bg-teal-500 text-black px-2 rounded-full">
                        {workflow.type}
                      </p>
                    </div>
                    <p className="text-justify leading-1">
                      {(workflow?.description as string)
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="bg-red-900 text-white rounded-xl py-1 px-2 w-full"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => router.push(`/workflows/${workflow.id}`)}
                        className="bg-teal-900 text-white rounded-xl py-1 px-2 w-full"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>
      {/* Popup components */}
      {showAddPopup && (
        <div
          id="add_workflow"
          className="fixed inset-0 z-50 bg-slate-800/75 backdrop-blur-sm flex items-start justify-center overflow-auto"
        >
          <div className="bg-white dark:bg-slate-900 mt-24 rounded-xl p-6 w-full max-w-xl shadow-lg relative">
            {/* Floating Cancel */}
            <button
              onClick={() => setShowAddPopup(false)}
              className="absolute top-4 right-4"
            >
              <Image
                src={"/icons/close.svg"}
                width={24}
                height={24}
                alt="Close Icon"
              />
            </button>

            <p className="text-2xl font-bold text-teal-500 mb-4">
              Add New Workflow
            </p>

            {/* Workflows Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="flex items-center">
                <label
                  htmlFor="name"
                  className="bg-teal-400 border border-teal-400 text-black px-3 py-2 rounded-l-xl text-xl"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="border border-teal-400 rounded-r-xl text-xl px-3 py-2 w-full outline-none"
                  placeholder="Workflow name"
                  required
                />
              </div>

              {/* Type Field */}
              <div className="flex items-center">
                <label
                  htmlFor="type"
                  className="bg-teal-400 border border-teal-400 text-black px-3 py-2 rounded-l-xl text-xl"
                >
                  Type
                </label>
                <select
                  name="type"
                  id="type"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.type}
                  className="border border-teal-400 rounded-r-xl text-xl px-3 py-2 w-full outline-none"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Messages">Messages</option>
                  <option value="Data">Data</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              {/* Description Field */}
              <div>
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  className="w-full p-3 border border-teal-400 rounded-xl outline-none resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xl py-2 rounded-xl font-semibold transition-all"
              >
                Create Workflow
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
