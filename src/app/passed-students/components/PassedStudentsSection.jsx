"use client";

import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import useUser from "@/hooks/useUser";

export default function PassedStudentsSection() {
  const [students, setStudents] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const controls = useAnimation();
  const { user, loading } = useUser();

  // fetch data
  useEffect(() => {
    fetch("/api/passed-students?status=approved")
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []));
  }, []);

  // RIGHT → LEFT continuous animation
  useEffect(() => {
    if (students.length) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: students.length * 6,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [students, controls]);

  const pause = () => controls.stop();
  const resume = () => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: students.length * 6,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  // deep premium gradients
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-center p-8 md:p-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center md:text-left"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Passed Students
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-white/90 mt-3 text-lg font-medium"
            >
              Our Department Alumni
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-1 bg-white/60 rounded-full mt-4 mx-auto md:mx-0" 
            />
          </motion.div>

          {!loading && user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <Link href="/passed-students/submit">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-lg shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Info
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* SLIDER */}
      <div
        className="overflow-hidden"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <motion.div
          animate={controls}
          className="flex gap-8 w-max"
        >
          {[...students, ...students].map((s, i) => {

            const gradient =
              gradients[i % gradients.length];

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
                  src={s.photoUrl}
                  alt={s.name}
                  width={140}
                  height={140}
                  className="rounded-full border-4 border-white shadow-xl object-cover"
                />

                <h3 className="mt-6 text-xl font-bold">
                  {s.name}
                </h3>

                <p className="text-gray-300 text-sm">
                  Batch {s.batch}
                </p>

                <p className="text-indigo-300 text-sm mt-1">
                  {s.designation || "Graduate"}
                </p>

                <p className="text-gray-400 text-xs italic">
                  {s.company || "No company"}
                </p>

              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* EXPANDED MODAL */}
      <AnimatePresence>
        {expandedCard && (
          <>
            {/* overlay */}
            <motion.div
              className="fixed inset-0 bg-black/70 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedCard(null)}
            />

            {/* expanded card */}
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
                src={expandedCard.photoUrl}
                alt=""
                width={220}
                height={220}
                className="mx-auto rounded-full border-4 border-white"
              />

              <h3 className="text-3xl font-bold text-center mt-6">
                {expandedCard.name}
              </h3>

              <p className="text-center text-lg mt-2">
                Batch: {expandedCard.batch}
              </p>

              <p className="text-center mt-2">
                {expandedCard.designation}
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
