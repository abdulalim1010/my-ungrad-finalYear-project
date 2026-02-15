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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-bold text-gray-100">
            Passed Students
          </h2>
          <p className="text-gray-400 mt-2">
            Our Department Alumni
          </p>
        </div>

        {!loading && user && (
          <Link
            href="/passed-students/submit"
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
          >
            Add Info
          </Link>
        )}
      </div>

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
