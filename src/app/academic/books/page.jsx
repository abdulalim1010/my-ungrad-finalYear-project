"use client";

import { useEffect, useState, useMemo } from "react";
import { FileText, Filter, Download, Book, ExternalLink } from "lucide-react";

const YEARS = ["1st", "2nd", "3rd", "4th"];
const SEMESTERS = ["1st", "2nd"];

// Dynamic export for SSR
export const dynamic = "force-dynamic";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    fetch("/api/academic?type=books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setBooks([]);
        }
      })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (year && b.year !== year) return false;
      if (semester && b.semester !== semester) return false;
      return true;
    });
  }, [books, year, semester]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Book className="text-white" size={30} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Academic Books
          </h1>
          <p className="text-gray-600 mt-2">
            Download textbooks and reference materials
          </p>
        </div>

        {/* ===== FILTER ===== */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-green-600" />
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
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              No books found
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border-t-4 border-green-500"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Book className="text-green-600" size={20} />
                    <span className={`text-xs font-bold px-2 py-1 rounded ${book.linkUrl ? "bg-green-100 text-green-700" : "bg-green-100 text-green-700"}`}>
                      {book.linkUrl ? "LINK" : "BOOK"}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {book.subject || book.title}
                  </h3>

                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {book.year ? `${book.year} Year` : ""}
                    {book.year && book.semester ? " • " : ""}
                    {book.semester ? `${book.semester} Semester` : ""}
                  </p>

                  {book.linkUrl ? (
                    <a
                      href={book.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      <ExternalLink size={16} />
                      Open Link
                    </a>
                  ) : (
                    <a
                      href={`/api/academic/download/${book._id}`}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      download={book.fileName}
                    >
                      <Download size={16} />
                      Download
                    </a>
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
