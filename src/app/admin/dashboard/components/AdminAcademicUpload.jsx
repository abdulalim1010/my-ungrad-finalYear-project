"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AdminAcademicUpload({ type }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`/api/academic?type=${type}`);
        if (res.ok) {
          const data = await res.json();
          setUploadedFiles(data);
        }
      } catch (err) {
        console.error("Failed to fetch files:", err);
        MySwal.fire("Error", "Failed to fetch files", "error");
      }
    };
    fetchFiles();
  }, [type]);

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !subject || !title || !year || !semester)
      return MySwal.fire("Error", "Please fill all fields", "error");

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/academic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subject,
            type,
            year,
            semester,
            fileBase64: reader.result,
            fileName: file.name,
          }),
        });

        setLoading(false);

        if (!res.ok) {
          const data = await res.json();
          return MySwal.fire("Error", data.error || "Upload failed", "error");
        }

        MySwal.fire("Success", "Uploaded successfully", "success");

        // Reset form
        setFile(null);
        setSubject("");
        setTitle("");
        setYear("");
        setSemester("");

        // Refresh files
        const refresh = await fetch(`/api/academic?type=${type}`);
        const data = await refresh.json();
        setUploadedFiles(data);
      } catch (err) {
        console.error(err);
        setLoading(false);
        MySwal.fire("Error", "Upload failed", "error");
      }
    };

    reader.readAsDataURL(file);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!id) return;

    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This file will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/academic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        return MySwal.fire("Error", data.error || "Delete failed", "error");
      }

      MySwal.fire("Deleted!", "File deleted successfully.", "success");
      setUploadedFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-0">
      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow p-6 rounded space-y-4 max-w-xl mx-auto"
      >
        <h2 className="text-xl font-bold text-blue-700">
          Upload {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-full sm:w-1/2 rounded"
          >
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border p-2 w-full sm:w-1/2 rounded"
          >
            <option value="">Select Semester</option>
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
          </select>
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Desktop Table */}
      <div className="hidden md:block max-w-4xl mx-auto overflow-x-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-2">
          {type.charAt(0).toUpperCase() + type.slice(1)} Files
        </h2>
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.length === 0 && (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No files uploaded yet
                </td>
              </tr>
            )}
            {uploadedFiles.map((file) => (
              <tr key={file._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{file.title}</td>
                <td className="p-3">{file.subject}</td>
                <td className="p-3">{file.year}</td>
                <td className="p-3">{file.semester}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <a
                    href={file.fileUrl}
                    download={file.fileName}
                    className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {uploadedFiles.length === 0 && (
          <p className="text-center text-gray-500">No files uploaded yet</p>
        )}
        {uploadedFiles.map((file) => (
          <div
            key={file._id}
            className="bg-white shadow rounded p-4 flex flex-col space-y-2"
          >
            <div>
              <strong>Title:</strong> {file.title}
            </div>
            <div>
              <strong>Subject:</strong> {file.subject}
            </div>
            <div>
              <strong>Year:</strong> {file.year}
            </div>
            <div>
              <strong>Semester:</strong> {file.semester}
            </div>
            <div className="flex gap-2 mt-2">
              <a
  href={`/api/academic/download?id=${file._id}`}
  className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
>
  Download
</a>


              <button
                onClick={() => handleDelete(file._id)}
                className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
