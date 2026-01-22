"use client";

import { useEffect, useState } from "react";

// 🔥 IMPORTANT (build crash fix)
export const dynamic = "force-dynamic";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/academic?type=book")
      .then((res) => res.json())
      .then((data) => {
        // 🔥 SAFETY CHECK
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setBooks([]); // fallback
        }
      })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📚 Uploaded Books</h1>

      {books.length === 0 ? (
        <p className="text-gray-500">No books uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.subject}</p>

              <a
                href={book.downloadUrl}
                className="inline-block mt-3 text-sm text-orange-600 hover:underline"
                target="_blank"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
