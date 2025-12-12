"use client";
import Image from "next/image";
import logoimage from "../../../src/assets/logoo.png";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  Home,
  BookOpen,
  Users,
  FlaskConical,
  Phone,
  LibraryBig,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(null);

  const navLinks = [
    { name: "Home", icon: <Home size={18} />, href: "/" },
    {
      name: "Academic",
      icon: <LibraryBig size={18} />,
      submenu: [
        { label: "Programs", href: "/academic/programs" },
        { label: "Syllabus", href: "/academic/syllabus" },
        { label: "Class Routine", href: "/academic/routine" },
      ],
    },
    {
      name: "Research",
      icon: <FlaskConical size={18} />,
      submenu: [
        { label: "Research Areas", href: "/research/areas" },
        { label: "Publications", href: "/research/publications" },
        { label: "Projects", href: "/research/projects" },
      ],
    },
    {
      name: "Students",
      icon: <Users size={18} />,
      submenu: [
        { label: "Student List", href: "/students" },
        { label: "Clubs", href: "/students/clubs" },
        { label: "Achievements", href: "/students/achievements" },
      ],
    },
    {
      name: "Contact",
      icon: <Phone size={18} />,
      submenu: [
        { label: "Department Office", href: "/contact/office" },
        { label: "Location", href: "/contact/location" },
        { label: "Support", href: "/contact/support" },
      ],
    },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-blue-700 shadow-xl z-50"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* FIXED LOGO */}
        <motion.div className="flex items-center gap-3 cursor-pointer select-none">
          <Image
            src={logoimage}
            alt="Department Logo"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <h1 className="text-xl font-bold text-white">My Department</h1>
        </motion.div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-white">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative"
              onMouseEnter={() => setHoverMenu(link.name)}
              onMouseLeave={() => setHoverMenu(null)}
            >
              <a className="flex items-center gap-1 hover:text-blue-300 transition cursor-pointer">
                {link.icon}
                {link.name}
              </a>

              {link.submenu && hoverMenu === link.name && (
                <div className="absolute bg-white text-gray-700 shadow-lg rounded-lg mt-2 w-48 p-2">
                  {link.submenu.map((sub, i) => (
                    <a
                      key={i}
                      href={sub.href}
                      className="block px-4 py-2 hover:bg-blue-100 rounded-md"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg px-6 py-4 text-gray-800 space-y-4"
          >
            {navLinks.map((link) => (
              <li key={link.name}>
                {!link.submenu ? (
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-lg py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </a>
                ) : (
                  <>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      {link.icon} {link.name}
                    </p>

                    <div className="pl-6 space-y-1">
                      {link.submenu.map((sub, i) => (
                        <a
                          key={i}
                          href={sub.href}
                          className="block py-1 text-gray-700 hover:text-blue-600"
                          onClick={() => setOpen(false)}
                        >
                          • {sub.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
