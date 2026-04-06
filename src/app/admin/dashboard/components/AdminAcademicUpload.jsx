"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { showSuccess, showError, showDeleteConfirm, showWarning } from "@/utils/swal";
import { Upload, FileText, Download, Trash2, Link as LinkIcon } from "lucide-react";
import { auth } from "@/app/components/firebase";

export default function AdminAcademicUpload({ type: fixedType }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [type, setType] = useState(fixedType || "note");
  const [year, setYear] = useState("1st");
  const [semester, setSemester] = useState("1st");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [inputType, setInputType] = useState("file");

  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsub();
    }
  }, []);

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

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!subject || !year || !semester) {
      showWarning("Please fill all fields");
      return;
    }

    if (inputType === "file" && !file) {
      showWarning("Please select a file");
      return;
    }

    if (inputType === "link" && !link) {
      showWarning("Please enter a link");
      return;
    }

    setLoading(true);

    try {
      let res;
      if (inputType === "link") {
        res = await fetch("/api/academic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            type,
            year,
            semester,
            linkUrl: link,
            fileType: "link",
          }),
        });
      } else {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!["pdf", "docx", "doc"].includes(fileExtension)) {
          showError("Only PDF or DOCX files are allowed");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", subject);
        formData.append("type", type);
        formData.append("year", year);
        formData.append("semester", semester);

        res = await fetch("/api/academic", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showSuccess("Added successfully");
      setSubject("");
      setFile(null);
      setLink("");
      loadUploadedFiles();
    } catch (err) {
      console.error(err);
      showError("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showDeleteConfirm("Delete", "Are you sure you want to delete this?");
    if (!result.isConfirmed) return;

    if (!currentUser?.email) {
      showError("Admin authentication required");
      return;
    }

    await fetch("/api/academic", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminEmail: currentUser.email }),
    });

    loadUploadedFiles();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">📤 Academic Upload</h1>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => { setInputType("file"); setLink(""); }}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${inputType === "file" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            <FileText size={16} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => { setInputType("link"); setFile(null); }}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${inputType === "link" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            <LinkIcon size={16} /> Add Link
          </button>
        </div>

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

          {inputType === "file" ? (
            <input
              key="file-input"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border p-2 w-full rounded"
            />
          ) : (
            <input
              key="link-input"
              type="url"
              value={link || ""}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://drive.google.com/... or any link"
              className="border p-2 w-full rounded"
            />
          )}

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📂 Uploaded Files</h2>

        {loadingList ? (
          <p>Loading...</p>
        ) : uploadedFiles.length === 0 ? (
          <p>No files yet</p>
        ) : (
          <div className="space-y-2">
            {uploadedFiles.map((f) => (
              <div
                key={f._id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-semibold">{f.subject}</p>
                  <p className="text-xs text-gray-500">
                    {f.year} Year · {f.semester} Semester
                    {f.linkUrl && " · Link"}
                  </p>
                </div>

                <div className="flex gap-3">
                  {f.linkUrl ? (
                    <a
                      href={f.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 text-sm flex items-center gap-1"
                    >
                      <LinkIcon size={14} /> Open
                    </a>
                  ) : (
                    <a
                      href={`/api/academic/download/${f._id}`}
                      className="text-blue-600 text-sm flex items-center gap-1"
                      target="_blank"
                    >
                      <Download size={14} /> Download
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
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