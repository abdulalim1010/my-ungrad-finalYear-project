"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Plus, Trash2, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { showSuccess, showError, showDeleteConfirm } from "@/utils/swal";

export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Ongoing",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/research/projects", { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/research/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add project");

      setForm({ title: "", description: "", status: "Ongoing" });
      setSuccess("Project added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      load();
    } catch (err) {
      setError(err.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    const result = await showDeleteConfirm("Delete Project", "Are you sure you want to delete this project?");
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch("/api/research/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete project");
      showSuccess("Project deleted successfully");
      load();
    } catch (err) {
      showError("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FlaskConical className="text-purple-600" size={32} />
          Manage Research Projects
        </h1>
        <p className="text-gray-600 mt-2">Add and manage research projects</p>
      </div>

      {/* Add Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Project</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              placeholder="Enter project title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the project..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            onClick={add}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Add Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Existing Projects ({items.length})
        </h2>

        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-600" size={48} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FlaskConical className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-600">No projects added yet</p>
            <p className="text-gray-500 mt-2">Add your first project using the form above</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item, index) => {
              const isCompleted = item.status === "Completed";
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-500 to-emerald-500"
                            : "bg-gradient-to-br from-yellow-500 to-orange-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="text-white" size={24} />
                        ) : (
                          <Clock className="text-white" size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => del(item._id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete project"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
