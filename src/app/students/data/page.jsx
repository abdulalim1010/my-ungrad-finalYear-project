"use client";

import { useEffect, useState } from "react";

export default function PublicStudentsDataPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/students", { cache: "no-store" });
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error loading students:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedData = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const cardGradients = [
    "from-blue-50 to-indigo-50",
    "from-green-50 to-emerald-50",
    "from-purple-50 to-pink-50",
    "from-amber-50 to-orange-50",
    "from-cyan-50 to-sky-50",
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading students data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Students Data
      </h1>

      <div className="space-y-6">
        {paginatedData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No students data found
          </div>
        )}

        {paginatedData.map((s, idx) => (
          <div
            key={s._id}
            className={`bg-gradient-to-r ${cardGradients[idx % cardGradients.length]} shadow-lg rounded-xl p-6 border border-gray-200`}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {s.name} ({s.studentId})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <p>
                <strong>Register No:</strong> {s.registerNumber || "-"}
              </p>
              <p>
                <strong>Session:</strong> {s.session || "-"}
              </p>
              <p>
                <strong>Year:</strong> {s.year || "-"}
              </p>

              <p>
                <strong>District:</strong> {s.district || "-"}
              </p>
              <p>
                <strong>Email:</strong> {s.email || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {s.phone || "-"}
              </p>

              <p className="md:col-span-3">
                <strong>Address:</strong> {s.address || "-"}
              </p>

              <p className="md:col-span-3">
                <strong>Gender:</strong> {s.gender || "-"} |{" "}
                <strong>Religion:</strong> {s.religion || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          <span className="font-semibold text-blue-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}