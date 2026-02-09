"use client";

import { useEffect, useState, useMemo } from "react";

export default function AdminStudentsPage() {
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 3; // এক পেজে 3 student card দেখাবে

  /* ================= LOAD STUDENTS ================= */
  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const res = await fetch("/api/students", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSavedData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading students:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    return savedData.filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId?.includes(search) ||
        s.registerNumber?.includes(search)
    );
  }, [search, savedData]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading students...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Students Data (Admin)
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, ID or register number"
        className="border px-4 py-2 rounded mb-6 w-full"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // search করলে পেজ reset হবে
        }}
      />

      {/* Students Cards */}
      <div className="space-y-6">
        {paginatedData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No students data found
          </div>
        )}

        {paginatedData.map((s) => (
          <div
            key={s._id}
            className="bg-white shadow rounded-xl p-6 border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              {s.name} ({s.studentId})
            </h2>

            {/* Grid: 2 rows, 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row 1 */}
              <p>
                <strong>Register No:</strong> {s.registerNumber || "-"}
              </p>
              <p>
                <strong>Session:</strong> {s.session || "-"}
              </p>
              <p>
                <strong>Year:</strong> {s.year || "-"}
              </p>

              {/* Row 2 */}
              <p>
                <strong>District:</strong> {s.district || "-"}
              </p>
              <p>
                <strong>Email:</strong> {s.email || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {s.phone || "-"}
              </p>

              {/* Row 3: full width */}
              <p className="md:col-span-3">
                <strong>Address:</strong> {s.address || "-"}
              </p>

              <p className="md:col-span-3">
                <strong>Gender:</strong> {s.gender || "-"} |{" "}
                <strong>Religion:</strong> {s.religion || "-"}
              </p>

              <p className="md:col-span-3 text-gray-500">
                Added on: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
          >
            Previous
          </button>

          <span className="font-semibold text-blue-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
