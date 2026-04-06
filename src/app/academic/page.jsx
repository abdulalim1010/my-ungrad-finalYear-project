import Link from "next/link";
import { BookOpen, FileText, Calendar, Download, Eye } from "lucide-react";

export const dynamic = "force-dynamic"; // ✅ FIX

export default async function AcademicPage() {
  let files = [];

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/academic`, {
      cache: "no-store",
    });

    if (res.ok) {
      files = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch academic files:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Academic Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access course materials, notes, books, routines, and syllabi for all
            years and semesters
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link href="/academic/class-notes" className="card">
            <FileText size={32} />
            <h3>Class Notes</h3>
          </Link>
          <Link href="/academic/books" className="card">
            <BookOpen size={32} />
            <h3>Books</h3>
          </Link>
          <Link href="/academic/routine" className="card">
            <Calendar size={32} />
            <h3>Routine</h3>
          </Link>
          <Link href="/academic/syllabus" className="card">
            <FileText size={32} />
            <h3>Syllabus</h3>
          </Link>
        </div>

        {/* Files */}
        {files.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-600 text-lg">
              No academic files available yet
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((f) => (
              <div
                key={f._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-blue-600"
              >
                <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
                  {f.type?.toUpperCase() || "FILE"}
                </span>

                <h3 className="font-bold text-xl text-gray-900 mt-3 mb-2">
                  {f.subject || f.title}
                </h3>

                <p className="text-sm font-medium text-gray-700">
                  {f.year} Year • {f.semester} Semester
                </p>

                <div className="flex gap-2 pt-4">
                  <a
                    href={f.fileUrl}
                    target="_blank"
                    className="flex-1 btn-view"
                  >
                    <Eye size={16} /> View
                  </a>
                  <a
                    href={f.fileUrl}
                    download
                    className="flex-1 btn-download"
                  >
                    <Download size={16} /> Download
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
