"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  LogOut,
  BookOpen,
  FlaskConical,
  FileText,
  GraduationCap,
  UserCog,
  Calendar,
  Newspaper,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/components/firebase";
import { useState } from "react";

const menu = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
/* ================= PAYMENTS ================= */{
  name: "Payments",
  href: "/admin/dashboard/payments",
  icon: FileText,
},

  /* ================= PASSED STUDENTS ================= */
  {
    name: "Passed Students",
    href: "/admin/dashboard/passed-students",
    icon: Users,
  },

  /* ================= STUDENTS DATA (ADMIN) ================= */
  {
    name: "Students Data",
    href: "/admin/dashboard/students",
    icon: Users,
  },

  /* ================= ACADEMIC ================= */
  {
    name: "Academic Files",
    icon: BookOpen,
    submenu: [
      { name: "Notes", href: "/admin/dashboard/academic/notes" },
      { name: "Books", href: "/admin/dashboard/academic/books" },
      { name: "Syllabus", href: "/admin/dashboard/academic/syllabus" },
      { name: "Routine", href: "/admin/dashboard/academic/routine" },
      {
        name: "Previous Questions",
        href: "/admin/dashboard/academic/previous-questions",
      },
    ],
  },

  /* ================= RESEARCH ================= */
  {
    name: "Research",
    icon: FlaskConical,
    submenu: [
      { name: "Research Areas", href: "/admin/dashboard/research/areas" },
      {
        name: "Publications",
        href: "/admin/dashboard/research/publications",
      },
      { name: "Projects", href: "/admin/dashboard/research/projects" },
    ],
  },

  /* ================= FACULTY MEMBERS ================= */
  {
    name: "Faculty Members",
    icon: GraduationCap,
    submenu: [
      { name: "Teachers", href: "/admin/dashboard/faculty/teachers" },
      { name: "Staff", href: "/admin/dashboard/faculty/staff" },
    ],
  },

  /* ================= GALLERY ================= */
  {
    name: "Gallery",
    icon: FileText,
    submenu: [
      { name: "All Gallery", href: "/admin/dashboard/gallery" },
      { name: "Requests", href: "/admin/dashboard/gallery/requests" },
    ],
  },

  {
    name: "Notices",
    href: "/admin/dashboard/notice",
    icon: Bell,
  },

  /* ================= EVENTS ================= */
  {
    name: "Events",
    href: "/admin/dashboard/events",
    icon: Calendar,
  },

  /* ================= NEWS ================= */
  {
    name: "News",
    href: "/admin/dashboard/news",
    icon: Newspaper,
  },

  {
    name: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-2xl">
      {/* ===== HEADER ===== */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
        <p className="text-xs text-blue-200">Management Dashboard</p>
      </div>

      {/* ===== NAV ===== */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;

          /* -------- NORMAL MENU -------- */
          if (!item.submenu) {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    active
                      ? "bg-white text-blue-900 shadow-lg"
                      : "hover:bg-blue-700 hover:translate-x-1"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          }

          /* -------- SUB MENU -------- */
          const isOpen = openMenu === item.name;

          return (
            <div key={item.name}>
              <button
                onClick={() => setOpenMenu(isOpen ? null : item.name)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <Icon size={20} />
                <span className="font-medium flex-1 text-left">
                  {item.name}
                </span>
              </button>

              {isOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((sub) => {
                    const active = pathname === sub.href;

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-3 py-2 rounded-md text-sm transition-all
                          ${
                            active
                              ? "bg-blue-600 text-white"
                              : "text-blue-200 hover:bg-blue-700"
                          }
                        `}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ===== LOGOUT ===== */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={() => auth && signOut(auth)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
