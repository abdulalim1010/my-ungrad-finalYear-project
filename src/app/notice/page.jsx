"use client";

import { useEffect, useState } from "react";
import { FileText, Download, AlertCircle } from "lucide-react";

export default function PublicNoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/notices", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load notices");
      }

      const data = await res.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notice fetch error:", err);
      setError("⚠️ Notice load korte problem hocche. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  /* ===========================
        UI STATES
  ============================ */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <AlertCircle className="mx-auto text-red-600 mb-3" size={40} />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={loadNotices}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📢 Notices</h1>

      {notices.length === 0 ? (
        <p className="text-gray-600 text-center">
          No notices available right now.
        </p>
      ) : (
        <div className="space-y-6">
          {notices.map((n) => (
            <div
              key={n._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h2 className="font-semibold text-lg sm:text-xl">
                {n.title}
              </h2>

              <p className="mt-2 text-sm sm:text-base text-gray-700">
                {n.description}
              </p>

              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                📅 {new Date(n.createdAt).toLocaleString("en-GB")}
              </p>

               {/* FILE PREVIEW + DOWNLOAD */}
               {n.fileUrl && (
                 <div className="mt-4 space-y-3">
                   {/* Desktop Preview */}
                   <div className="hidden md:block">
                     {n.fileUrl.startsWith('http') ? (
                       <iframe
                         src={n.fileUrl}
                         className="w-full h-[450px] border rounded-lg"
                         loading="lazy"
                       />
                     ) : (
                       <p className="text-center text-gray-500 py-8">
                         File preview not available for this file type
                       </p>
                     )}
                   </div>

                   {/* Buttons */}
                   <div className="flex flex-wrap gap-3">
                     <a
                       href={n.fileUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm"
                     >
                       <FileText size={16} />
                       View File
                     </a>

                     <a
                       href={n.fileUrl}
                       download
                       className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm"
                     >
                       <Download size={16} />
                       Download
                     </a>
                   </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
