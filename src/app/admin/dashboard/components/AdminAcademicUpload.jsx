"use client";

import { useEffect, useState } from "react";
import syllabusData from "@/data/syllabus.json";

export default function AdminAcademicUpload({ type = "note" }) {
  const [year, setYear] = useState("1st");
  const [semester, setSemester] = useState("1st");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  /* =========================
     SYLLABUS SUBJECTS (ONLY FOR NOTE)
  ========================= */
  let syllabusSubjects = [];

  if (
    type === "note" &&
    syllabusData &&
    Array.isArray(syllabusData.years)
  ) {
    const yearObj = syllabusData.years.find(
      (y) => y.year.startsWith(year)
    );

    if (yearObj) {
      const semObj = yearObj.semesters.find(
        (s) => s.semester.startsWith(semester)
      );

      syllabusSubjects = semObj ? semObj.subjects : [];
    }
  }

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
        if (!res.ok) throw new Error(data.error);

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

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this file?")) return;

    try {
      const res = await fetch("/api/academic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error();
      loadUploadedFiles();
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="space-y-10">
      {/* UPLOAD */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded shadow space-y-4">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="border p-2 w-full">
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="border p-2 w-full">
          <option value="1st">1st Semester</option>
          <option value="2nd">2nd Semester</option>
        </select>

        {type === "note" ? (
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Subject</option>
            {syllabusSubjects.map((s) => (
              <option key={s.code} value={s.title}>
                {s.code} - {s.title}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Book / Routine Title"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 w-full"
          />
        )}

        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />

        <button disabled={loading} className="bg-blue-600 text-white py-2 rounded w-full">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white p-6 rounded shadow">
        {loadingList ? (
          <p>Loading...</p>
        ) : uploadedFiles.length === 0 ? (
          <p>No files uploaded</p>
        ) : (
          uploadedFiles.map((f) => (
            <div key={f._id} className="flex justify-between border-b py-2">
              <span>{f.subject}</span>
              <button onClick={() => handleDelete(f._id)} className="text-red-600">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
