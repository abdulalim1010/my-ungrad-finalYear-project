 "use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  FlaskConical,
  Phone,
  Library,
  GraduationCap,
  LogOut,
  Mail,
  Bell,
  Info
} from "lucide-react";

import logoimage from "../../../src/assets/logoo.png";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [notices, setNotices] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  /* 🔐 Auth + Role */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setRole(data.user.role || "user");
        } else {
          setUser(null);
          setRole(null);
        }
      } catch {
        setUser(null);
        setRole(null);
      }
    };

    fetchUser();

    const handleFocus = () => {
      fetchUser();
    };

    window.addEventListener("focus", handleFocus);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchUser();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* 🔔 Fetch Notices for Notifications */
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) {
          // Get recent notices (last 5)
          const recentNotices = data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setNotices(recentNotices);
          // Check for unread (notices from last 24 hours)
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const unread = recentNotices.filter(
            (n) => new Date(n.createdAt) > oneDayAgo
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      }
    };

    fetchNotices();
    // Refresh notices every 5 minutes
    const interval = setInterval(fetchNotices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /* Click outside to close notifications */
  useEffect(() => {
    if (!showNotifications) return;
    
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setRole(null);
    window.location.href = "/";
  };

  /* ===== NAV LINKS ===== */
  const navLinks = [
    { name: "Home", icon: Home, href: "/" },
    {
      name: "Academic",
      icon: Library,
      submenu: [
        { label: "Syllabus", href: "/academic/syllabus" },
        { label: "Class Notes", href: "/academic/class-notes" },
        { label: "Books", href: "/academic/books" },
        { label: "Routine", href: "/academic/routine" },
        { label: "Previous Questions", href: "/academic/previous-questions" },
      ],
    },
    {
      name: "Research",
      icon: FlaskConical,
      submenu: [
        { label: "Research Areas", href: "/research/areas" },
        { label: "Publications", href: "/research/publications" },
        { label: "Projects", href: "/research/projects" },
      ],
    },
     {
       name: "Students",
       icon: Users,
       submenu: [
         { label: "Student List", href: "/students/data" },
         { label: "Results", href: "/students/results" },
       ],
     },
    {
      name: "Faculty Members",
      icon: GraduationCap,
      submenu: [
        { label: "Teachers", href: "/teachers" },
        { label: "Staff Members", href: "/staff" },
      ],
    },

      { name: "About", icon: Info, href: "/about" },
    {
      name: "Notice",
      icon: BookOpen,
      submenu: [
        { label: " Notices", href: "/notice" },
        
      ],
    },
  ];

  return (
    <>
      {/* ================= TOP SUB NAVBAR ================= */}
      <div className="fixed top-0 left-0 w-full bg-slate-900 text-white text-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>brureee@department.edu</span>
          </div>

          <div className="flex items-center gap-4">
            {role?.toLowerCase() === "admin" && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-1 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-500"
              >
                🛠 Admin Dashboard
              </Link>
            )}

            {user ? (
              <>
                <span>{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-[40px] left-0 w-full bg-blue-700 z-40"
      >
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image src={logoimage} alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-white">
              EEE Department
            </span>
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <ul className="hidden md:flex items-center gap-6 text-white font-medium">
            {/* Notification Bell */}
            <li className="relative notification-dropdown">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-blue-600 rounded-lg transition"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto notification-dropdown">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Recent Notices</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {notices.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notices available
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notices.map((notice) => (
                        <Link
                          key={notice._id}
                          href="/notice"
                          onClick={() => setShowNotifications(false)}
                          className="block p-4 hover:bg-blue-50 transition"
                        >
                          <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                            {notice.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {notice.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="p-3 border-t border-gray-200 text-center">
                    <Link
                      href="/notice"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Notices
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href && pathname === link.href;

              return (
                <li
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setHoverMenu(link.name)}
                  onMouseLeave={() => setHoverMenu(null)}
                >
                  {!link.submenu ? (
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 transition
                        ${isActive ? "text-yellow-300" : "hover:text-blue-300"}`}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  ) : (
                    <button className="flex items-center gap-2 hover:text-blue-300">
                      <Icon size={18} />
                      {link.name}
                    </button>
                  )}

                  {/* SUBMENU */}
                  <AnimatePresence>
                    {link.submenu && hoverMenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-4 w-64 bg-white rounded-xl shadow-xl p-4"
                      >
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}

            {/* CONTACT */}
            <li>
              <Link
                href="/contact"
                className="flex items-center gap-2 hover:text-blue-300"
              >
                <Phone size={18} />
                Contact
              </Link>
            </li>
          </ul>

          {/* ===== MOBILE BUTTON ===== */}
          <button
            className="md:hidden text-white p-2 hover:bg-blue-600 rounded-lg transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* ===== MOBILE MENU ===== */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="md:hidden bg-white"
            >
              <ul className="px-6 py-4 space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {!link.submenu ? (
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <>
                        <div
                          className="flex justify-between cursor-pointer"
                          onClick={() =>
                            setExpandedMenu(
                              expandedMenu === link.name ? null : link.name
                            )
                          }
                        >
                          {link.name}
                          <span>
                            {expandedMenu === link.name ? "−" : "+"}
                          </span>
                        </div>

                        {expandedMenu === link.name && (
                          <div className="pl-4 space-y-2 mt-2">
                            {link.submenu.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-gray-600"
                              >
                                • {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}

                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* SPACER */}
      <div className="h-[130px]" />
    </>
  );
}
