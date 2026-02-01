"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import AddPassedStudentForm from "./components/AddPassedStudentForm";

export default function AdminPassedStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending, approved, all

  // Helper function to get valid image URL
  const getImageUrl = (url) => {
    if (!url) return "/logoo.png"; // Default fallback
    try {
      new URL(url);
      return url;
    } catch {
      return "/logoo.png"; // Fallback if URL is invalid
    }
  };

  async function loadStudents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/passed-students?status=${filter}`, { 
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, [filter]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch("/api/passed-students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      Swal.fire("Updated ✅", `Student ${status}`, "success");
      loadStudents();
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    }
  }

  async function deleteStudent(id) {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the alumni profile",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await fetch("/api/passed-students", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          throw new Error("Failed to delete");
        }

        Swal.fire("Deleted ✅", "Alumni has been deleted", "success");
        loadStudents();
      }
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    }
  }

  if (loading) return (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="mt-2 text-gray-500">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-600">Error: {error}</p>
      <button 
        onClick={loadStudents}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-8">
      {showAddForm && (
        <AddPassedStudentForm
          onClose={() => setShowAddForm(false)}
          onSuccess={loadStudents}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Alumni Management</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Alumni
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["pending", "approved", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f === "all" ? "All Alumni" : `${f} Requests`}
          </button>
        ))}
      </div>

      {filter === "pending" && students.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No pending requests 🎉</p>
          <p className="text-gray-400 text-sm mt-2">All student requests have been processed</p>
        </div>
      )}

      {filter !== "pending" && students.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No alumni found</p>
          <p className="text-gray-400 text-sm mt-2">Add alumni using the &quot;Add New Alumni&quot; button</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {students.map((s) => (
          <div key={s._id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center">
              <Image 
                src={getImageUrl(s.imageUrl || s.photoUrl)} 
                width={100} 
                height={100} 
                alt={s.name} 
                className="rounded-full object-cover border-4 border-blue-100"
                unoptimized
              />
            </div>
            <h2 className="text-lg font-semibold text-center mt-3">{s.name}</h2>
            <p className="text-center text-sm text-gray-500">Batch: {s.batch || "N/A"}</p>
            
            {s.designation && (
              <p className="text-center text-sm text-blue-600 mt-1">{s.designation}</p>
            )}
            {s.company && (
              <p className="text-center text-sm text-gray-500">@ {s.company}</p>
            )}

            <p className="text-center text-xs text-gray-400 mt-3">
              Submitted: {new Date(s.createdAt).toLocaleDateString()}
            </p>

            {s.status === "pending" ? (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateStatus(s._id, "approved")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(s._id, "rejected")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => deleteStudent(s._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
