"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

const gradients = [
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-pink-600",
  "from-emerald-600 to-teal-700",
  "from-orange-500 to-red-600",
  "from-rose-600 to-red-700",
];

export default function PassedStudentsSection() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // 🔍 Search states
  const [searchName, setSearchName] = useState("");
  const [searchBatch, setSearchBatch] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(
          `${baseURL}/api/passed-students?status=approved`
        );
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch approved students", err);
      }
    }
    fetchStudents();
  }, []);

  // 🔎 Filter logic (Name + Batch only)
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const nameMatch = s.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const batchMatch = s.batch
        .toLowerCase()
        .includes(searchBatch.toLowerCase());

      return nameMatch && batchMatch;
    });
  }, [students, searchName, searchBatch]);

  const scrollStudents =
    searchName || searchBatch
      ? filteredStudents
      : [...students, ...students];

  const selectedStudent = students.find((s) => s._id === selectedId);

  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
            Passed Students
            <span className="block text-blue-600 dark:text-blue-400 mt-2">
              EEE Department, BRUR
            </span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Celebrating the successful graduates of the Department of Electrical
            and Electronic Engineering.
          </p>

          <Link
            href="/passed-students/submit"
            className="inline-block mt-8 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
          >
            Add Your Name
          </Link>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="mb-16 flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full md:w-72 px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Search by Batch (e.g. 2019)"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            className="w-full md:w-72 px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* ===== AUTO SCROLLING CARDS ===== */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div
            className="flex gap-6 md:gap-8 w-max"
            animate={{
              x:
                selectedId ||
                isHovering ||
                searchName ||
                searchBatch
                  ? 0
                  : ["0%", "-50%"],
            }}
            transition={{
              repeat:
                selectedId ||
                isHovering ||
                searchName ||
                searchBatch
                  ? 0
                  : Infinity,
              duration: 35,
              ease: "linear",
            }}
          >
            {scrollStudents.map((s, idx) => {
              const gradient = gradients[idx % gradients.length];

              return (
                <motion.div
                  key={`${s._id}-${idx}`}
                  onClick={() => setSelectedId(s._id)}
                  whileHover={{ scale: 1.08 }}
                  className={`
                    min-w-[260px] md:min-w-[300px]
                    h-[380px] md:h-[420px]
                    rounded-3xl p-6
                    text-white cursor-pointer
                    shadow-2xl
                    bg-gradient-to-br ${gradient}
                  `}
                >
                  <Image
                    src={s.photoUrl}
                    width={140}
                    height={140}
                    alt={s.name}
                    unoptimized
                    className="w-[140px] h-[140px] rounded-full mx-auto border-4 border-white/80 object-cover shadow-xl"
                  />

                  <h3 className="text-xl md:text-2xl font-extrabold mt-6 text-center">
                    {s.name}
                  </h3>

                  <p className="text-center text-sm mt-2 opacity-90">
                    {s.batch}
                  </p>

                  <p className="text-center mt-3 font-semibold">
                    {s.designation}
                  </p>

                  <p className="text-center text-sm mt-1 italic opacity-80">
                    {s.company}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ===== SELECTED MODAL ===== */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-[100]"
              onClick={() => setSelectedId(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 max-w-sm w-full text-white shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-5 bg-white/30 hover:bg-white/60 rounded-full px-3 py-1 text-black"
                >
                  ✕
                </button>

                <Image
                  src={selectedStudent.photoUrl}
                  width={240}
                  height={240}
                  alt={selectedStudent.name}
                  unoptimized
                  className="w-[220px] h-[220px] rounded-full mx-auto border-4 border-white object-cover shadow-2xl"
                />

                <h3 className="text-3xl font-bold mt-8 text-center">
                  {selectedStudent.name}
                </h3>

                <p className="text-center mt-3 text-lg">
                  {selectedStudent.batch}
                </p>

                <p className="text-center mt-3 font-semibold">
                  {selectedStudent.designation}
                </p>

                <p className="text-center mt-2 italic opacity-90">
                  {selectedStudent.company}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
