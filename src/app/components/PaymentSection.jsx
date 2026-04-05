"use client";

import { motion } from "framer-motion";
import SSLPaymentButton from "./SSLPaymentButton";
import { useEffect, useState } from "react";

export default function PaymentSection() {
  const [settings, setSettings] = useState({
    sectionTitle: "💳 Support My Work",
    paymentDescription: "If you find my work helpful or want to support my journey as a developer, you can contribute here. Your support helps me continue learning, building projects, and creating better content. Every contribution means a lot ❤️",
    extraInfo: "(For project support / personal donation / course fee / etc.)"
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        const loaded = {};
        data.forEach(s => loaded[s.key] = s.value);
        if (loaded.sectionTitle || loaded.paymentDescription) {
          setSettings(prev => ({ ...prev, ...loaded }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-20 px-4 bg-[#0f172a] text-[#e2e8f0]">

      <div className="max-w-6xl mx-auto">

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 backdrop-blur-xl shadow-xl"
        >

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 blur-2xl opacity-40"></div>

          {/* Content */}
          <div className="relative z-10">

            {/* TITLE */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              {settings.sectionTitle}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-300 max-w-2xl mx-auto mb-4 text-lg leading-relaxed text-center">
              {settings.paymentDescription}
            </p>

            {/* OPTIONAL EXTRA INFO */}
            {settings.extraInfo && (
              <p className="text-sm text-gray-400 mb-8 text-center">
                {settings.extraInfo}
              </p>
            )}

            {/* PAYMENT BUTTON */}
            <div className="flex justify-center mt-8">
              <SSLPaymentButton />
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}