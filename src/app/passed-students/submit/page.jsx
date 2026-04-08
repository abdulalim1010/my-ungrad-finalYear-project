"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function PassedStudentSubmit() {
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    const photo = formData.get("photo");
    if (photo && photo.size > 2 * 1024 * 1024) {
      Swal.fire("Error ❌", "Photo must be less than 2MB", "error");
      setLoading(false);
      return;
    }

    try {
    const apiURL = baseURL ? `${baseURL}/api/passed-students` : "/api/passed-students";
    
    const res = await fetch(apiURL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Success 🎉", "Request submitted for approval", "success");
      form.reset();
    } catch (err) {
      Swal.fire("Error ❌", err.message || "Something went wrong", "error");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Passed Student Submission
      </h1>
      <p className="text-gray-500 mb-6">
        Submit your information to be listed as a passed student
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="name"
            required
            placeholder="e.g. Md. Abdul Alim"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500
                       focus:border-green-500 text-gray-800"
          />
        </div>

        {/* BATCH - Session & Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Session
            </label>
            <select
              name="session"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         focus:border-green-500 text-gray-800 bg-white"
            >
              <option value="">Select Session</option>
              {Array.from({ length: 24 }, (_, i) => {
                const year = 2012 + i;
                return (
                  <option key={year} value={`${year}-${year + 1}`}>
                    {year}-{year + 1}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              University Batch
            </label>
            <select
              name="universityBatch"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         focus:border-green-500 text-gray-800 bg-white"
            >
              <option value="">Select Batch</option>
              {Array.from({ length: 80 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Batch {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department Batch
            </label>
            <select
              name="departmentBatch"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         focus:border-green-500 text-gray-800 bg-white"
            >
              <option value="">Select Batch</option>
              {Array.from({ length: 80 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Batch {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COMPANY - Optional */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Company / Organization <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            name="company"
            placeholder="e.g. Power Grid Bangladesh"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500
                       focus:border-green-500 text-gray-800"
          />
        </div>

        {/* PHOTO UPLOAD */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            required
            className="w-full px-4 py-3 border border-dashed border-gray-400 rounded-xl
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-green-600 file:text-white
                       hover:file:bg-green-700
                       cursor-pointer bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG / PNG (Max 2MB recommended)
          </p>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700
                     text-white py-3 rounded-xl font-semibold
                     transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
