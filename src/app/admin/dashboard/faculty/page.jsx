"use client";

import Link from "next/link";
import { GraduationCap, Users, ArrowRight } from "lucide-react";

export default function FacultyPage() {
  const sections = [
    {
      title: "Teachers Management",
      description: "Manage faculty teachers including HOD, professors, and associate professors",
      href: "/admin/dashboard/faculty/teachers",
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Staff Management",
      description: "Manage departmental staff members and their profiles",
      href: "/admin/dashboard/faculty/staff",
      icon: Users,
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Faculty Members</h1>
        <p className="text-gray-600 mt-2">
          Manage teachers and staff of the EEE Department
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color}`}
              />

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Icon size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                      <p className="text-white/80 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}