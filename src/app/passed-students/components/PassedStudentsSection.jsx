"use client";

import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import useUser from "@/hooks/useUser";

export default function PassedStudentsSection() {
  const [students, setStudents] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const { user, loading } = useUser();
  const controls = useAnimation();

  useEffect(() => {
    fetch("/api/passed-students?status=approved")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setStudents(data));
  }, []);

  // RIGHT → LEFT animation
  useEffect(() => {
    if (students.length) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: students.length * 5,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [students, controls]);

  // Hover to pause animation
  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    if (students.length) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: students.length * 5,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  };

  // Toggle card expansion
  const toggleCard = (student) => {
    setExpandedCard(expandedCard === student ? null : student);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-16 overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-14">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Proud Passed Students 🎓
          </h2>
          <p className="text-gray-600 mt-2">
            EEE Department – Alumni Highlights
          </p>
        </div>

        {/* 🔥 CTA BUTTON - Show only if user is logged in and is a student */}
        {!loading && user && (
          <Link
            href="/passed-students/submit"
            className="relative px-8 py-4 rounded-full font-semibold text-white 
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
            hover:scale-105 transition-all shadow-xl"
          >
            ✨ Add Your Information
          </Link>
        )}
      </div>

      {/* ================= SLIDER ================= */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="flex gap-6 w-max"
          animate={controls}
        >
          {[...students, ...students].map((s, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: expandedCard === s ? 1.3 : 1,
                zIndex: expandedCard === s ? 10 : 1
              }}
              whileHover={{ 
                scale: expandedCard === s ? 1.3 : 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              onClick={() => toggleCard(s)}
              className={`
                cursor-pointer rounded-3xl p-6
                bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed]
                text-white shadow-2xl backdrop-blur-xl
                transition-all duration-300
                ${expandedCard === s ? "fixed inset-4 md:inset-10 lg:inset-20 z-50 max-w-2xl mx-auto h-fit" : "w-72"}
              `}
            >
              <div className={`${expandedCard === s ? "flex flex-row items-center gap-8" : ""}`}>
                <Image
                  src={s.photoUrl}
                  alt={s.name}
                  width={expandedCard === s ? 280 : 140}
                  height={expandedCard === s ? 280 : 140}
                  className={`
                    mx-auto rounded-full border-4 border-white object-cover
                    ${expandedCard === s ? "w-60 h-60 md:w-72 md:h-72" : "w-32 h-32"}
                  `}
                />
                <div className={expandedCard === s ? "text-left" : "text-center"}>
                  <h3 className={`${expandedCard === s ? "text-3xl" : "text-xl"} font-bold`}>
                    {s.name}
                  </h3>
                  <p className={`mt-2 opacity-90 ${expandedCard === s ? "text-lg" : "text-sm"}`}>
                    Batch: {s.batch}
                  </p>
                  <p className={`mt-1 ${expandedCard === s ? "text-xl" : "text-sm"}`}>
                    {s.designation || "Graduate"}
                  </p>
                  <p className={`italic opacity-80 mt-1 ${expandedCard === s ? "text-lg" : "text-xs"}`}>
                    {s.company || "—"}
                  </p>
                  {expandedCard === s && (
                    <p className="mt-4 text-sm opacity-75">
                      {s.email && `📧 ${s.email}`}
                    </p>
                  )}
                </div>
              </div>
              
              {expandedCard === s && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(null);
                  }}
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= OVERLAY FOR EXPANDED CARD ================= */}
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedCard(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
