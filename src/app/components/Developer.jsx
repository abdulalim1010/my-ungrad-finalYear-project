"use client";

import Image from "next/image";
import { useState } from "react";

export default function Developer() {
  const [open, setOpen] = useState(false);

  const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:Abdul Alim
EMAIL:alim.12016032@student.brur.ac.bd
TEL:01739243457
URL:https://alim-next-portfolio.vercel.app/
END:VCARD
`;

  const downloadVCard = () => {
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Abdul_Alim.vcf";
    a.click();
  };

  return (
    <div className="w-full px-3 md:px-6 mt-6">
      {/* Gradient Border */}
      <div className="w-full p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">

        {/* Card */}
        <div
          onClick={() => setOpen(!open)}
          className="w-full cursor-pointer rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 py-3 md:px-6 md:py-4 border border-white/20 shadow-md hover:shadow-xl transition-all duration-300"
        >
          
          {/* TOP ROW */}
          <div className="flex items-center justify-between gap-3">
            
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 min-w-0">
              
              {/* Image */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0">
                <Image
                  src="/profile.jpg"
                  alt="Abdul Alim"
                  fill
                  className="rounded-full object-cover border border-white shadow"
                />
              </div>

              {/* Info */}
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white truncate">
                  Abdul Alim
                </h2>

                <p className="text-[11px] text-gray-500">
                  💻 Full Stack Developer
                </p>

                <div className="flex flex-wrap gap-x-3 text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  <a
                    href="mailto:alim.12016032@student.brur.ac.bd"
                    className="hover:text-blue-500 truncate"
                  >
                    📧 Email
                  </a>

                  <a
                    href="tel:01739243457"
                    className="hover:text-green-500"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <span className="text-[10px] md:text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full whitespace-nowrap">
              ● Available
            </span>
          </div>

          {/* EXPAND SECTION */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              open ? "max-h-40 mt-3" : "max-h-0"
            }`}
          >
            <div className="border-t border-gray-300/40 dark:border-gray-700 pt-3">

              {/* GRID INFO */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-700 dark:text-gray-300">
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium">EEE</p>
                </div>

                <div>
                  <p className="text-gray-500">Batch</p>
                  <p className="font-medium">13</p>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-gray-500">Portfolio</p>
                  <a
                    href="https://alim-next-portfolio.vercel.app/"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Visit
                  </a>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadVCard();
                  }}
                  className="flex-1 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs"
                >
                  📥 Save Contact
                </button>

                <a
                  href="https://alim-next-portfolio.vercel.app/"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-1.5 text-center rounded-md border text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  🚀 View Portfolio
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}