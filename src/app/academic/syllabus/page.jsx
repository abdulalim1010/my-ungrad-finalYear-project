"use client";

import { useMemo, useState } from "react";
import syllabusData from "@/data/syllabus.json";
import { FileText, Filter, BookOpen } from "lucide-react";
import { generateSemesterSyllabusPDF } from "@/utils/syllabusPdf";

const YEARS = ["1st", "2nd", "3rd", "4th"];
const SEMESTERS = ["1st", "2nd"];

export default function SyllabusPage() {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  // =============== NORMALIZE + FILTER =================
  const filteredData = useMemo(() => {
    let result = [];

    syllabusData.years.forEach((y) => {
      const yearNumber = y.year.split(" ")[0]; // "1st"

      if (year && year !== yearNumber) return;

      y.semesters.forEach((s) => {
        const semesterNumber = s.semester.split(" ")[0]; // "1st"

        if (semester && semester !== semesterNumber) return;

        result.push({
          year: y.year,
          semester: s.semester,
          subjects: s.subjects,
        });
      });
    });

    return result;
  }, [year, semester]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <FileText className="text-white" size={30} />
          </div>
           <h1 className="text-5xl font-bold text-blue-800 mb-8">
            {syllabusData.university}
          </h1>
          <h1 className="text-3xl font-bold text-gray-800">
            {syllabusData.program}
          </h1>
         
          <p className="text-gray-600">{syllabusData.duration}</p>
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
                <option key={y} value={y}>{y} Year</option>
              ))}
            </select>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border px-4 py-3 rounded-lg"
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>{s} Semester</option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
{filteredData.length === 0 ? (
  <div className="bg-white p-12 rounded-2xl shadow text-center">
    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
    <p className="text-gray-600 text-lg">No syllabus found</p>
  </div>
) : (
  <div className="space-y-10">
    {filteredData.map((item, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-md overflow-hidden"
      >
        {/* ===== CARD HEADER ===== */}
        <div className="px-6 py-4 border-b bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {item.year}
            </h2>
            <p className="text-sm text-gray-600">
              {item.semester}
            </p>
          </div>

          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full w-fit">
            Total Subjects: {item.subjects.length}
          </span>
        </div>

        {/* ===== SUBJECT LIST ===== */}
        <div className="px-6 py-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.subjects.map((sub, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 hover:shadow transition"
              >
                <p className="font-semibold text-gray-800 mb-1">
                  {sub.title}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <BookOpen size={14} className="inline mr-1" />
                  {sub.code}
                </p>

                <p className="text-xs text-gray-500">
                  Credits: {sub.credits} | Contact Hours:{" "}
                  {sub.contact_hours || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CARD FOOTER (DOWNLOAD BUTTON) ===== */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={() => {
              const pdf = generateSemesterSyllabusPDF({
                program: syllabusData.program,
                year: item.year,
                semester: item.semester,
                subjects: item.subjects,
              });
              pdf.save(`${item.year}_${item.semester}_Syllabus.pdf`);
            }}
            className="flex items-center gap-2 px-6 py-2.5
                       bg-orange-600 text-white rounded-lg
                       hover:bg-orange-700 transition text-sm font-medium"
          >
            Download PDF
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
