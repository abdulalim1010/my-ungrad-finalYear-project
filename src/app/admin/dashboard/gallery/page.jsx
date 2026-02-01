"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/gallery", {
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
      console.error("Error loading gallery items:", err);
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
      loadItems();
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    }
  }

  async function remove(id) {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the gallery item",
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

        Swal.fire("Deleted ✅", "Gallery item has been deleted", "success");
        loadItems();
      }
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
    }
  }

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  if (loading) return (
    <div className="p-10 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="mt-2 text-gray-500">Loading gallery...</p>
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
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <button 
          onClick={loadItems}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No gallery items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.studentName}</p>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                    item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
                <div className="flex gap-2 mt-4">
                  {item.status === "pending" && (
                    <button
                      onClick={() => approve(item._id)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => remove(item._id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
