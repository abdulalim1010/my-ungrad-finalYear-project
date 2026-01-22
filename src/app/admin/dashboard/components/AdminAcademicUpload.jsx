"use client";

import { useEffect, useState } from "react";

export default function AdminAcademicUpload({ type: fixedType }) {
  const [type, setType] = useState(fixedType || "note");
  const [year, setYear] = useState("1st");
  const [semester, setSemester] = useState("1st");

  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // ================= FETCH FILES =================
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

  // ================= UPLOAD =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !subject) {
      alert("Subject & file required");
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const res = await fetch("/api/academic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${type.toUpperCase()} FILE`,
            subject,
            type,
            year,
            semester,
            fileBase64: reader.result,
            fileName: file.name,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        alert("✅ Uploaded successfully");
        setFile(null);
        setSubject("");
        loadUploadedFiles();
      } catch (err) {
        alert("❌ Upload failed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    await fetch("/api/academic", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadUploadedFiles();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
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
            accept=".pdf"
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

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📂 Uploaded Files</h2>

        {uploadedFiles.length === 0 ? (
          <p className="text-gray-500">No files yet</p>
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
              <button
                onClick={() => handleDelete(f._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
