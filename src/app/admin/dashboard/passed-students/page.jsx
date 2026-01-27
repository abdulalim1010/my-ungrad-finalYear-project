"use client";

import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import Image from "next/image";

export default function AdminPassedStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
      FETCH PENDING STUDENTS
  ========================== */
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "/api/passed-students?status=pending",
        { cache: "no-store" }
      );

      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* =========================
        APPROVE STUDENT
  ========================== */
  async function handleApprove(id) {
    const result = await Swal.fire({
      title: "Approve Student?",
      text: "This student will be visible on the website",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, Approve",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch("/api/passed-students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });

      Swal.fire("Approved!", "Student is now live 🎉", "success");
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", "Approval failed", "error");
    }
  }

  /* =========================
        REJECT STUDENT
  ========================== */
  async function handleReject(id) {
    const result = await Swal.fire({
      title: "Reject Student?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch("/api/passed-students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });

      Swal.fire("Rejected!", "Student request removed ❌", "info");
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", "Rejection failed", "error");
    }
  }

  /* =========================
          LOADING
  ========================== */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Loading passed students...
      </div>
    );
  }

  /* =========================
            UI
  ========================== */
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        🎓 Passed Students Approval
      </h1>

      {students.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No pending requests 🎉
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border">
                  <Image
                    src={student.photoUrl}
                    alt={student.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {student.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Batch: {student.batch}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Designation:</span>{" "}
                  {student.designation || "—"}
                </p>
                <p>
                  <span className="font-medium">Organization:</span>{" "}
                  {student.company || "—"}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleApprove(student._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(student._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
