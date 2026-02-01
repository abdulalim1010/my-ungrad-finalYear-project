"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function GalleryRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/gallery?status=pending", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error loading gallery requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to approve");
      }

      Swal.fire("Approved ✅", "Gallery item has been approved", "success");
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    }
  }

  async function remove(id) {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the gallery request",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await fetch("/api/admin/gallery", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          throw new Error("Failed to delete");
        }

        Swal.fire("Deleted ✅", "Gallery request has been deleted", "success");
        setItems(items.filter((i) => i._id !== id));
      }
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    }
  }

  if (loading) return (
    <div className="p-10 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="mt-2 text-gray-500">Loading gallery requests...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <p className="text-red-600">Error: {error}</p>
      <button 
        onClick={loadItems}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gallery Requests</h1>
        <button 
          onClick={loadItems}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No pending requests 🎉</p>
          <p className="text-gray-400 text-sm mt-2">All gallery requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl shadow-lg flex gap-6 items-center hover:shadow-xl transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-32 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.studentName}</p>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Submitted: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(item._id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => remove(item._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
