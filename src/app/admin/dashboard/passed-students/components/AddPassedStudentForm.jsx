"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function AddPassedStudentForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    session: "",
    universityBatch: "",
    departmentBatch: "",
    company: "",
    linkedin: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("session", formData.session);
      data.append("universityBatch", formData.universityBatch);
      data.append("departmentBatch", formData.departmentBatch);
      data.append("company", formData.company);
      data.append("linkedin", formData.linkedin);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await fetch("/api/admin/passed-students", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to add student");
      }

      Swal.fire("Success ✅", "Alumni added successfully!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Alumni
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session *
                </label>
                <select
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Session</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const year = 2012 + i;
                    return (
                      <option key={year} value={`${year}-${year + 1}`}>
                        {year}-{year + 1}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University Batch *
                </label>
                <select
                  name="universityBatch"
                  value={formData.universityBatch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Batch</option>
                  {Array.from({ length: 80 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Batch {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Batch *
                </label>
                <select
                  name="departmentBatch"
                  value={formData.departmentBatch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Batch</option>
                  {Array.from({ length: 80 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Batch {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Google, BRAC University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Alumni"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
