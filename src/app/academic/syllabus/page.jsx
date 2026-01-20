"use client";

import { useMemo, useState } from "react";
import syllabusData from "@/data/syllabus.json";
import {
  FileText,
  Download,
  Filter,
  BookOpen,
  Calendar,
} from "lucide-react";

const YEARS = ["1st", "2nd", "3rd", "4th"];
const SEMESTERS = ["1st", "2nd"];

export default function SyllabusPage() {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  // ================= FILTER LOGIC =================
  const filteredSyllabus = useMemo(() => {
    return syllabusData.filter((item) => {
      const semesterMatch = semester
        ? String(item.semester) ===
          semester.replace("st", "").replace("nd", "").replace("rd", "")
        : true;

      const yearMatch = year
        ? Math.ceil(item.semester / 2) ===
          Number(year.replace("st", "").replace("nd", "").replace("rd", ""))
        : true;

      return semesterMatch && yearMatch;
    });
  }, [year, semester]);

  // ================= DOWNLOAD JSON =================
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <FileText className="text-white" size={30} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Course Syllabus
          </h1>
          <p className="text-gray-600">
            Official syllabus (JSON based, always available)
          </p>
        </div>

        {/* ================= FILTER ================= */}
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

        {/* ================= CONTENT ================= */}
        {filteredSyllabus.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No syllabus found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSyllabus.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col"
              >
                <div className="flex justify-between mb-3">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    Semester {s.semester}
                  </span>
                  <span className="text-xs text-gray-500">
                    {s.credits} Credits
                  </span>
                </div>

                <h3 className="font-semibold text-gray-800 mb-1">
                  {s.course_title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  <BookOpen size={14} className="inline mr-1" />
                  {s.course_code}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  Contact Hours: {s.contact_hours}
                </p>

                {/* ACTION */}
                <div className="mt-auto">
                  <button
                    onClick={() =>
                      downloadJSON(
                        s,
                        `${s.course_code.replace(" ", "_")}_syllabus.json`
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm"
                  >
                    <Download size={16} />
                    Download JSON
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
