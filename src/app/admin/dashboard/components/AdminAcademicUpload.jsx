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

  /* ================= FETCH FILES ================= */
  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/academic?type=${type}`);
      const data = await res.json();
      setUploadedFiles(data);
    } catch (err) {
      MySwal.fire("Error", "Failed to load files", "error");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [type]);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !subject || !year || !semester || !file) {
      return MySwal.fire("Error", "All fields are required", "error");
    }

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

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          return MySwal.fire("Error", data.error || "Upload failed", "error");
        }

        MySwal.fire("Success", "File uploaded successfully", "success");

        setTitle("");
        setSubject("");
        setYear("");
        setSemester("");
        setFile(null);

        fetchFiles();
      } catch (err) {
        setLoading(false);
        MySwal.fire("Error", "Upload failed", "error");
      }
    };

    reader.readAsDataURL(file);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This file will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/academic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        return MySwal.fire("Error", data.error || "Delete failed", "error");
      }

      MySwal.fire("Deleted", "File removed successfully", "success");
      setUploadedFiles((prev) => prev.filter((f) => f._id !== id));
    } catch {
      MySwal.fire("Error", "Delete failed", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-8 px-4 max-w-6xl mx-auto">
      {/* ================= UPLOAD FORM ================= */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow rounded p-6 space-y-4 max-w-xl mx-auto"
      >
        <h2 className="text-xl font-bold text-blue-700 text-center">
          Upload {type.toUpperCase()}
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

        <div className="flex gap-3">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-1/2 rounded"
          >
            <option value="">Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border p-2 w-1/2 rounded"
          >
            <option value="">Semester</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
          </select>
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 w-full rounded"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Year</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No files uploaded
                </td>
              </tr>
            )}

            {uploadedFiles.map((file) => (
              <tr key={file._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{file.title}</td>
                <td className="p-3 text-center">{file.subject}</td>
                <td className="p-3 text-center">{file.year}</td>
                <td className="p-3 text-center">{file.semester}</td>
                <td className="p-3 flex gap-2 justify-center">
   <a
  href={`/api/academic/download/${file._id}`}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Download
</a>

                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {uploadedFiles.map((file) => (
          <div key={file._id} className="bg-white shadow rounded p-4 space-y-2">
            <p><b>Title:</b> {file.title}</p>
            <p><b>Subject:</b> {file.subject}</p>
            <p><b>Year:</b> {file.year}</p>
            <p><b>Semester:</b> {file.semester}</p>

            <div className="flex gap-2 pt-2">
              <a
  href={`/api/academic/download/${file._id}`}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Download
</a>

              <button
                onClick={() => handleDelete(file._id)}
                className="bg-red-500 text-white flex-1 py-1 rounded"
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
