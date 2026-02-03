"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, Download, Trash2, ClipboardList } from "lucide-react";

const YEARS = ["1st", "2nd", "3rd", "4th"];
const SEMESTERS = ["1st", "2nd"];

export default function AdminPreviousQuestionsPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);

  // Fetch files on load
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/academic?type=previous-question");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!subject || !year || !semester || !file) {
      setMessage("Please fill all fields and select a file");
      return;
    }

    // Only allow DOCX files
    const fileExt = file.name.split(".").pop().toLowerCase();
    if (fileExt !== "docx") {
      setMessage("Only DOCX files are allowed for previous questions");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("type", "previous-question");
    formData.append("year", year);
    formData.append("semester", semester);

    try {
      const res = await fetch("/api/academic", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Previous question uploaded successfully!");
        setSubject("");
        setYear("");
        setSemester("");
        setFile(null);
        fetchFiles();
      } else {
        setMessage(data.error || "Upload failed");
      }
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch("/api/academic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage("File deleted successfully");
        fetchFiles();
      } else {
        setMessage("Delete failed");
      }
    } catch (err) {
      setMessage("Delete failed: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-600 rounded-lg">
          <ClipboardList className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Previous Questions
          </h1>
          <p className="text-gray-600">Upload and manage previous exam questions (DOCX only)</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload size={20} className="text-indigo-600" />
          Upload New Question Paper
        </h2>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Electrical Machines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y} Year</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>{s} Semester</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DOCX File *
              </label>
              <input
                type="file"
                accept=".docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Only DOCX files are allowed</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? "Uploading..." : "Upload Question Paper"}
          </button>
        </form>
      </div>

      {/* Files List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-indigo-600" />
          Uploaded Question Papers ({files.length})
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : files.length === 0 ? (
          <p className="text-gray-500">No previous questions uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Subject</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">File</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f._id} className="border-b">
                    <td className="p-3">{f.subject}</td>
                    <td className="p-3">{f.year}</td>
                    <td className="p-3">{f.semester}</td>
                    <td className="p-3">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                        {f.fileType?.toUpperCase() || "DOCX"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <a
                        href={f.downloadUrl || f.fileUrl}
                        download
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                        title="Download"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
