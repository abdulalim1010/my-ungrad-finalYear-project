"use client";

import { useState, useMemo, useEffect } from "react";
import StudentForm from "../components/StudentForm";

export default function StudentsPage() {
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // 🔵 Load Data from MongoDB
  const loadStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setSavedData(data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // 🔵 Save + Reload
  const handleFormSubmit = async (data) => {
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    loadStudents();
  };

  // 🔵 Filtered Data
  const filteredData = useMemo(() => {
    return savedData.filter((item) => {
      return (
        (item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.studentId.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase())) &&
        (filterSession ? item.session === filterSession : true) &&
        (filterYear ? item.year === filterYear : true) &&
        (filterDistrict ? item.district === filterDistrict : true)
      );
    });
  }, [search, filterSession, filterYear, filterDistrict, savedData]);

  // 🔵 Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">

      <h1 className="text-5xl font-bold text-center mb-10 text-blue-800">
        Give Your Data Correctly
      </h1>

      {/* Student Form */}
      <StudentForm onSubmit={handleFormSubmit} />

      {/* Search + Filter Section */}
      {savedData.length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-lg border border-blue-100">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Search & Filter</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
            >
              <option value="">All Sessions</option>
              {[...Array(20)].map((_, i) => {
                const y = 2010 + i;
                const s = `${y}-${y + 1}`;
                return (
                  <option key={s} value={s}>{s}</option>
                );
              })}
            </select>

            <select
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">All Years</option>
              {["1", "2", "3", "4"].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>

            <select
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {[
                "Dhaka","Chittagong","Khulna","Rajshahi",
                "Barisal","Sylhet","Rangpur","Mymensingh"
              ].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Cards */}
      {paginatedData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">All Students</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-white to-blue-50 border-l-4 border-blue-400 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition"
              >
                <h3 className="text-2xl font-semibold mb-3 text-blue-700">{item.name}</h3>

                <p><strong>ID:</strong> {item.studentId}</p>
                <p><strong>Session:</strong> {item.session}</p>
                <p><strong>Year:</strong> {item.year}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Address:</strong> {item.address}</p>
                <p><strong>District:</strong> {item.district}</p>
                <p><strong>Department:</strong> Electrical & Electronic Engineering</p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              Previous
            </button>

            <span className="px-4 py-2 font-bold text-blue-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
