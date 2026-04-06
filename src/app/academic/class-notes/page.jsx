"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Download, Eye, Filter, BookOpen, Calendar, ExternalLink } from "lucide-react";

const YEARS = ["1st", "2nd", "3rd", "4th"];
const SEMESTERS = ["1st", "2nd"];

export default function ClassNotePage() {
  const [files, setFiles] = useState([]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/academic?type=note";
      if (year) url += `&year=${year.toLowerCase()}`;
      if (semester) url += `&semester=${semester.toLowerCase()}`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      const notes = Array.isArray(data)
        ? data.filter((f) => f.type.toLowerCase() === "note")
        : [];
      setFiles(notes);
    } catch (err) {
      console.error("Fetch notes error:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [year, semester]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FileText className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Class Notes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access comprehensive class notes for all courses
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Filter Notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y} Year
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <BookOpen size={16} className="inline mr-1" />
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s} Semester
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-600 text-lg">No class notes found</p>
            <p className="text-gray-500 text-sm mt-2">
              {year || semester
                ? "Try adjusting your filters"
                : "Notes will appear here when uploaded"}
            </p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((f) => (
            <div
              key={f._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-t-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  <span className={`text-xs font-bold px-2 py-1 rounded ${f.linkUrl ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {f.linkUrl ? "LINK" : "NOTE"}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {f.year} Year
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {f.subject || f.title}
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-4">
                {f.semester} Semester
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                {f.linkUrl ? (
                  <a
                    href={f.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                  >
                    <ExternalLink size={16} />
                    Open Link
                  </a>
                ) : (
                  <>
                    <a
                      href={`/api/academic/download/${f._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Eye size={16} />
                      View PDF
                    </a>
                    <a
                      href={`/api/academic/download/${f._id}`}
                      download={f.fileName || `${f.subject}_${f.type}.pdf`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
