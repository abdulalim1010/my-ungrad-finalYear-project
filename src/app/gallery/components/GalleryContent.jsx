"use client";

import { useState } from "react";

export default function GalleryContent({ items }) {
  const [visibleCount, setVisibleCount] = useState(6);

  const showMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div className="max-w-7xl mx-auto px-6">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          No gallery items available yet.
        </p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleItems.map((item) => (
              <div
                key={item._id.toString()}
                className="
                  group relative bg-white rounded-3xl overflow-hidden
                  shadow-xl hover:shadow-2xl
                  transition-all duration-500
                  hover:-translate-y-3
                "
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="
                      w-full h-64 object-cover
                      group-hover:scale-110 transition-transform duration-700
                    "
                  />

                  <div
                    className="
                      absolute inset-0 bg-gradient-to-t
                      from-black/60 via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-500
                    "
                  />
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-gray-400 italic">
                      — {item.studentName}
                    </span>

                    <span
                      className="
                        text-xs px-3 py-1 rounded-full
                        bg-blue-100 text-blue-700 font-semibold
                      "
                    >
                      Student Work
                    </span>
                  </div>
                </div>

                <div
                  className="
                    absolute inset-0 rounded-3xl
                    opacity-0 group-hover:opacity-100
                    transition duration-500
                    bg-gradient-to-tr from-blue-500/10 to-indigo-500/10
                  "
                />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={showMore}
                className="
                  px-8 py-3 bg-gradient-to-r from-blue-700 to-indigo-700
                  text-white font-semibold rounded-full
                  shadow-lg hover:shadow-xl
                  hover:scale-105 transition-all duration-300
                "
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}