"use client";

import { useEffect, useState } from "react";
import { showSuccess, showError, showDeleteConfirm } from "@/utils/swal";

export default function AdminAcademicUpload({ type: fixedType }) {
  const [type, setType] = useState(fixedType || "note");
  const [year, setYear] = useState("1st");
  const [semester, setSemester] = useState("1st");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState (null);

  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  /* ================= FETCH FILES ================= */
  const loadUploadedFiles = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/academic?type=${type}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setUploadedFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUploadedFiles([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadUploadedFiles();
  }, [type]);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !subject) {
      showWarning("Subject & file required");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      showError("Only PDF or DOCX allowed");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", subject);
      formData.append("type", type);
      formData.append("year", year);
      formData.append("semester", semester);

      const res = await fetch("/api/academic", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showSuccess("Uploaded successfully");
      setFile(null);
      setSubject("");
      loadUploadedFiles();
    } catch (err) {
      console.error(err);
      showError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await showDeleteConfirm("Delete File", "Are you sure you want to delete this file?");
    if (!result.isConfirmed) return;

    await fetch("/api/academic", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadUploadedFiles();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Upload */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">📤 Academic Upload</h1>

        <form onSubmit={handleUpload} className="space-y-4">
          {!fixedType && (
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="note">Notes</option>
              <option value="book">Books</option>
              <option value="routine">Routine</option>
            </select>
          )}

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
          </select>

          <input
            type="text"
            placeholder="Subject / Title"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📂 Uploaded Files</h2>

        {loadingList ? (
          <p>Loading...</p>
        ) : uploadedFiles.length === 0 ? (
          <p>No files yet</p>
        ) : (
          uploadedFiles.map((f) => (
            <div
              key={f._id}
              className="flex justify-between border p-3 rounded mb-2"
            >
              <div>
                <p className="font-semibold">{f.subject}</p>
                <p className="text-xs text-gray-500">
                  {f.year} Year · {f.semester} Semester
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/api/academic/download/${f._id}`}
                  className="text-blue-600 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(f._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
