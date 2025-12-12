"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import bannerImage from "../../assets/hero.jpg"
export default function Banner() {
  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-24">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10">

        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Build Your<span className="text-blue-400"> Modern Skills</span><br />
            With Our Professional Course
          </h1>

          <p className="text-gray-300 text-lg md:w-3/4">
            Join our Job Task Course and learn full-stack Next.js, API integration, Stripe payments, and professional UI design. 100% project-based learning.
          </p>

          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-lg font-semibold transition-all">
            Join Now
          </button>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex justify-center"
        >
          <Image
            src={bannerImage}  // তোমার ইমেজ path দিন
            alt="Banner Illustration"
            width={500}
            height={500}
            className="rounded-2xl shadow-lg"
          />
        </motion.div>

      </div>
    </section>
  );
}
