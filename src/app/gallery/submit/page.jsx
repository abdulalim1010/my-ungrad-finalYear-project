"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccess } from "@/utils/swal";

const thisYear = new Date().getFullYear();
const startYears = Array.from({ length: 25 }, (_, i) => thisYear - i); // From current year to 25 years ago

export default function SubmitGallery() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    showSuccess("Submitted successfully! Waiting for admin approval.");
    router.push("/gallery");
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Submit to Gallery</h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Title */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-800">Title</label>
          <input
            name="title"
            required
            placeholder="Artwork Title"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition outline-none shadow-sm bg-white"
          />
        </div>
        {/* Description */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-800">Description</label>
          <textarea
            name="description"
            required
            placeholder="Describe your artwork"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition outline-none shadow-sm bg-white resize-none"
          />
        </div>
        {/* Student Name */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-800">Your Name</label>
          <input
            name="studentName"
            required
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition outline-none shadow-sm bg-white"
          />
        </div>
        {/* Academic Session */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-800">Academic Session</label>
          <div className="flex gap-2 items-center">
            <select 
              name="sessionStart"
              required
              className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition outline-none shadow-sm bg-white"
            >
              {startYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span className="mx-2 text-gray-500 font-medium">-</span>
            <select 
              name="sessionEnd"
              required
              className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition outline-none shadow-sm bg-white"
            >
              {startYears.map((year) => (
                <option key={year} value={year + 1}>{year + 1}</option>
              ))}
            </select>
            <span className="ml-3 text-gray-400">to continue</span>
          </div>
        </div>
        {/* Image Upload */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-800">Upload Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="block w-full text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 file:font-semibold transition"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
