"use client";

import { useEffect, useState } from "react";
import { showSuccess, showError, showDeleteConfirm } from "@/utils/swal";
import useAdmin from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { Trash2, FileDown, Calendar, BookOpen } from "lucide-react";

export default function AdminResultsPage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [session, setSession] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  const loadResults = async () => {
    try {
      setLoadingResults(true);
      const res = await fetch("/api/results", { cache: "no-store" });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error loading results:", err);
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadResults();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !session || !year || !file) {
      return showError("All fields are required");
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return showError("File must be under 10MB");
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        setUploading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("session", session);
        formData.append("year", year);
        formData.append("file", file);

        const res = await fetch("/api/results", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        showSuccess("Result uploaded successfully");
        setTitle("");
        setSession("");
        setYear("");
        setFile(null);
        document.getElementById("file-input").value = "";
        loadResults();
      } catch (err) {
        showError(err.message);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    try {
      const result = await showDeleteConfirm(
        "Are you sure?",
        "This will permanently delete the result document."
      );

      if (result.isConfirmed) {
        const res = await fetch("/api/results", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Delete failed");
        }

        showSuccess("Result deleted successfully");
        loadResults();
      }
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Access denied. Admin privileges required.</p>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Upload Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Upload Result Document
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 2nd Year 3rd Semester Results"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session *
              </label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="e.g., 2023-2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document File (PDF, DOC, DOCX) *
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 10MB
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      {/* Existing Results */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Uploaded Results
        </h2>

        {loadingResults ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No result documents uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileDown className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {result.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {result.session} • {result.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(result.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`${result.fileUrl}?fl=attachment`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm flex items-center gap-2"
                  >
                    <FileDown size={16} />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(result._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
