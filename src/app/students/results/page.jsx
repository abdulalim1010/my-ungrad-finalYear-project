"use client";

import { useEffect, useState } from "react";
import { FileDown, Calendar, User, BookOpen } from "lucide-react";

export default function StudentsResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch("/api/results", { cache: "no-store" });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error loading results:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Results
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and download published result documents.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <p className="text-gray-500 text-lg">No results published yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileDown className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {result.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BookOpen size={16} />
                          Session: {result.session}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={16} />
                          Year: {result.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(result.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`${result.fileUrl}?fl=attachment`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap text-center"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
