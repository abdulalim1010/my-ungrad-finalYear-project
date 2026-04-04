"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Trash2, Loader2, AlertCircle, CheckCircle, Calendar, Users } from "lucide-react";
import { showSuccess, showError, showDeleteConfirm } from "@/utils/swal";

export default function PublicationsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    year: "",
    journal: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/research/publications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load publications");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validateForm = () => {
    if (
      !form.title.trim() ||
      !form.authors.trim() ||
      !/^\d{4}$/.test(form.year) ||
      !form.journal.trim()
    ) {
      setError("Please fill all fields correctly. Year must be 4 digits.");
      return false;
    }
    setError("");
    return true;
  };

  const add = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/research/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add publication");
      setForm({ title: "", authors: "", year: "", journal: "" });
      setSuccess("Publication added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    const result = await showDeleteConfirm("Delete Publication", "Are you sure you want to delete this publication?");
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/research/publications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete publication");
      showSuccess("Publication deleted successfully");
      load();
    } catch (e) {
      showError("Failed to delete publication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="text-blue-600" size={32} />
          Manage Publications
        </h1>
        <p className="text-gray-600 mt-2">Add and manage research publications</p>
      </div>

      {/* Add Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Publication</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
          className="space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publication Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter publication title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Authors *
              </label>
              <input
                type="text"
                value={form.authors}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
                placeholder="First Author, Second Author"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="YYYY"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Journal *
              </label>
              <input
                type="text"
                value={form.journal}
                onChange={(e) => setForm({ ...form, journal: e.target.value })}
                placeholder="Journal name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Add Publication</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Publications List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Existing Publications ({items.length})
        </h2>

        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <BookOpen className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-600">No publications added yet</p>
            <p className="text-gray-500 mt-2">Add your first publication using the form above</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="space-y-2">
                      {item.authors && (
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <Users size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{item.authors}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {item.journal && (
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-indigo-600" />
                            <span className="italic">{item.journal}</span>
                          </div>
                        )}
                        {item.year && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-600" />
                            <span>{item.year}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => del(item._id)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition ml-4"
                    title="Delete publication"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
