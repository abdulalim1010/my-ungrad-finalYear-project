"use client";

import { useState } from "react";
import { showSuccess, showError, showWarning } from "@/utils/swal";

export default function AcademicUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return showWarning("Select a file");

    // 🔥 HARD LIMIT (important)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      return showWarning("File must be under 8MB");
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/academic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Academic File",
            subject: "CSE",
            type: "note",
            year: "1st",
            semester: "1st",
            fileBase64: reader.result,
            fileName: file.name,
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error);

        showSuccess("Upload successful");
        setFile(null);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 max-w-md">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
