"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Filter, Download } from "lucide-react";

const YEARS = ["1st", "2nd", "3rd", "4th"];
const SEMESTERS = ["1st", "2nd"];

export default function SyllabusPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  /* ================= FETCH SYLLABUS FILES ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/academic?type=syllabus", {
          cache: "no-store",
        });
        const data = await res.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ================= FILTER ================= */
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      if (year && f.year !== year) return false;
      if (semester && f.semester !== semester) return false;
      return true;
    });
  }, [files, year, semester]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <FileText className="text-white" size={30} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Course Syllabus
          </h1>
          <p className="text-gray-600 mt-2">
            Download official syllabus (PDF / DOCX)
          </p>
        </div>

        {/* ===== FILTER ===== */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-orange-600" />
            <h2 className="font-semibold text-gray-800">Filter</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border px-4 py-3 rounded-lg"
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border px-4 py-3 rounded-lg"
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

        {/* ===== CONTENT ===== */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              No syllabus found
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((f) => (
              <div
                key={f._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {f.subject}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    {f.year} Year · {f.semester} Semester
                  </p>

                  <span className="inline-block text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full mb-4">
                    {f.format?.toUpperCase()}
                  </span>

                  <a
                    href={f.downloadUrl || f.fileUrl}
                    className="flex items-center justify-center gap-2
                               bg-orange-600 text-white
                               px-4 py-2 rounded-lg
                               hover:bg-orange-700 transition text-sm"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
