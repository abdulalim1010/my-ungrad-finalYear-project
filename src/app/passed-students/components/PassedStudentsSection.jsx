"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PassedStudentsSection() {
  const [students, setStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);

  useEffect(() => {
    fetch("/api/passed-students?status=approved")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, x: 120 }}   // 👉 right → left
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 py-16"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Proud Passed Students 🎓
          </h2>
          <p className="text-gray-600 mt-2">
            Passed students of EEE Department
          </p>
        </div>

        {/* BUTTON */}
        <Link
          href="/passed-students/submit"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Submit Your Data →
        </Link>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {students.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No passed students found
          </p>
        )}

        {students.map((s, index) => (
          <motion.div
            key={s._id}
            initial={{ opacity: 0, x: 80 }}   // 👉 card right → left
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => setActiveStudent(s)}
            className="cursor-pointer bg-white rounded-3xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <Image
              src={s.photoUrl}
              width={140}
              height={140}
              alt={s.name}
              className="mx-auto rounded-full object-cover"
            />
            <h3 className="mt-4 font-bold text-lg text-gray-800">
              {s.name}
            </h3>
            <p className="text-sm text-blue-600">{s.designation}</p>
          </motion.div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activeStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            onClick={() => setActiveStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, x: 100 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0.8, x: 100 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeStudent.photoUrl}
                width={180}
                height={180}
                alt={activeStudent.name}
                className="mx-auto rounded-full object-cover"
              />
              <h2 className="text-xl font-bold mt-4 text-gray-800">
                {activeStudent.name}
              </h2>
              <p className="text-blue-600 mt-1">
                {activeStudent.designation}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
