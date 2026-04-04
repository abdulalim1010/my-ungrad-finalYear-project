"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { showSuccess, showError, showDeleteConfirm } from "@/utils/swal";

export default function AdminResearchAreas() {
  const [areas, setAreas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/research/areas", { cache: "no-store" });
      const data = await res.json();
      setAreas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch areas:", err);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const addArea = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/research/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to add area");

      setTitle("");
      setDescription("");
      setSuccess("Research area added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchAreas();
    } catch (err) {
      setError(err.message || "Failed to add area");
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async (id) => {
    if (!confirm("Are you sure you want to delete this research area?")) return;

    try {
      setLoading(true);
      const res = await fetch("/api/research/areas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete area");
      showSuccess("Area deleted successfully");
      fetchAreas();
    } catch (err) {
      showError("Failed to delete area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Target className="text-indigo-600" size={32} />
          Manage Research Areas
        </h1>
        <p className="text-gray-600 mt-2">Add and manage research areas</p>
      </div>

      {/* Add Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Research Area</h2>

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
              Area Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Power Systems, Signal Processing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Describe the research area..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={addArea}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Add Research Area</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Areas List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Existing Research Areas ({areas.length})
        </h2>

        {loading && areas.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
          </div>
        ) : areas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Target className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-600">No research areas added yet</p>
            <p className="text-gray-500 mt-2">Add your first research area using the form above</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {areas.map((a, index) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Target className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                  </div>
                  <button
                    onClick={() => deleteArea(a._id)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete area"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-600 leading-relaxed">{a.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
