"use client";

import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function PassedStudentsSection() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [search, setSearch] = useState("");
  const controls = useAnimation();

  useEffect(() => {
    fetch("/api/passed-students?status=approved")
      .then(res => res.json())
      .then(data => {
        const studentData = Array.isArray(data) ? data : [];
        setStudents(studentData);
        setFilteredStudents(studentData);
      });
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredStudents(students);
    } else {
      const searchLower = search.toLowerCase();
      const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(searchLower) ||
        s.session?.toLowerCase().includes(searchLower) ||
        s.universityBatch?.toLowerCase().includes(searchLower) ||
        s.departmentBatch?.toLowerCase().includes(searchLower) ||
        s.company?.toLowerCase().includes(searchLower)
      );
      setFilteredStudents(filtered);
    }
  }, [search, students]);

  useEffect(() => {
    if (filteredStudents.length) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: filteredStudents.length * 6,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [filteredStudents, controls]);

  const pause = () => controls.stop();
  const resume = () => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: filteredStudents.length * 6,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  const gradients = [
    "from-red-900 via-red-700 to-red-800",
    "from-blue-900 via-blue-700 to-blue-800",
    "from-green-900 via-green-700 to-green-800",
    "from-purple-900 via-purple-700 to-purple-800",
    "from-indigo-900 via-indigo-700 to-indigo-800",
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 overflow-hidden">

      {/* HEADER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl"
      >
        <div className="absolute inset-0 opacity-30" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-center p-8 md:p-12 gap-6">
          
          {/* HEADING */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              🎓 Our Successful Graduates
            </h2>
            <p className="text-white/90 mt-3 text-lg font-medium">
              Proud Alumni of Our Department
            </p>
            <div className="h-1 w-28 bg-white/60 rounded-full mt-4 mx-auto md:mx-0" />
          </div>

          {/* SEARCH BAR & ADD BUTTON */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search graduates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 py-3 rounded-full bg-white/20 backdrop-blur text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:border-white w-64"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <Link href="/passed-students/submit">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">✨ Add Student Info</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* SLIDER */}
      {filteredStudents.length === 0 && search ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No graduates found matching "{search}"</p>
        </div>
      ) : (
        <div
          className="overflow-hidden"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <motion.div animate={controls} className="flex gap-8 w-max">
            {[...filteredStudents, ...filteredStudents].map((s, i) => {

            const gradient = gradients[i % gradients.length];

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                onClick={() => setExpandedCard(s)}
                className={`
                  cursor-pointer
                  w-72 h-96
                  rounded-3xl
                  bg-gradient-to-br ${gradient}
                  shadow-2xl
                  border border-white/10
                  backdrop-blur-xl
                  flex flex-col items-center
                  justify-center
                  text-white
                `}
              >

                <Image
                  src={s.photoUrl || "/placeholder-avatar.png"}
                  alt={s.name}
                  width={140}
                  height={140}
                  onError={(e) => { e.target.src = "/placeholder-avatar.png"; }}
                  className="rounded-full border-4 border-white shadow-xl object-cover"
                />

                <h3 className="mt-6 text-xl font-bold">
                  {s.name}
                </h3>

                <p className="text-gray-300 text-sm">
                  Session: {s.session}
                </p>

                <p className="text-indigo-300 text-sm mt-1">
                  University Batch: {s.universityBatch} | Dept Batch: {s.departmentBatch}
                </p>

                <p className="text-gray-400 text-xs italic">
                  {s.company || "No company"}
                </p>

              </motion.div>
            );
          })}
        </motion.div>
      </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {expandedCard && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedCard(null)}
            />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="
                fixed z-50
                top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                w-[90%] max-w-2xl
                rounded-3xl
                bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#0f2027]
                p-10 text-white shadow-2xl
              "
            >

              <Image
                src={expandedCard.photoUrl || "/placeholder-avatar.png"}
                alt=""
                width={220}
                height={220}
                onError={(e) => { e.target.src = "/placeholder-avatar.png"; }}
                className="mx-auto rounded-full border-4 border-white"
              />

              <h3 className="text-3xl font-bold text-center mt-6">
                {expandedCard.name}
              </h3>

              <p className="text-center text-lg mt-2">
                Session: {expandedCard.session}
              </p>

              <p className="text-center mt-2 text-indigo-300">
                University Batch: {expandedCard.universityBatch} | Dept Batch: {expandedCard.departmentBatch}
              </p>

              <p className="text-center italic text-gray-300">
                {expandedCard.company}
              </p>

              <button
                onClick={() => setExpandedCard(null)}
                className="absolute top-4 right-4 text-2xl"
              >
                ✕
              </button>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}