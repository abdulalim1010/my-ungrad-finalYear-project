"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useAdmin from "@/hooks/useAdmin";
import { Users, FileText, Bell, Clock, TrendingUp, BookOpen, GraduationCap } from "lucide-react";

export default function AdminDashboardPage() {
  const { isAdmin, loading } = useAdmin();
  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    academicFiles: 0,
    notices: 0,
    pending: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const data = await res.json();
        setStats({
          users: data.users || 0,
          students: data.students || 0,
          academicFiles: data.academicFiles || 0,
          notices: data.notices || 0,
          pending: data.pending || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Access denied. Admin privileges required.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Students Data",
      value: stats.students,
      icon: GraduationCap,
      color: "cyan",
      bgGradient: "from-cyan-500 to-cyan-600",
      href: "/admin/dashboard/students",
    },
    {
      title: "Academic Files",
      value: stats.academicFiles,
      icon: BookOpen,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
    },
    {
      title: "Notices",
      value: stats.notices,
      icon: Bell,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Pending Items",
      value: stats.pending,
      icon: Clock,
      color: "orange",
      bgGradient: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin dashboard</p>
      </div>

      {loadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            const cardContent = (
              <div
                key={card.title}
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${card.href ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${card.bgGradient}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <TrendingUp className={`text-${card.color}-500`} size={20} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </h3>
                <p className={`text-3xl font-bold text-${card.color}-600`}>
                  {card.value}
                </p>
              </div>
            );

            // If card has href, wrap in Link
            return card.href ? (
              <a key={card.title} href={card.href} className="block">
                {cardContent}
              </a>
            ) : (
              cardContent
            );
          })}
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="/admin/dashboard/students"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200"
          >
            <GraduationCap className="text-cyan-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Students Data</h3>
            <p className="text-sm text-gray-600">View and manage students</p>
          </a>
          <a
            href="/admin/dashboard/academic"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <FileText className="text-blue-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Manage Academic Files</h3>
            <p className="text-sm text-gray-600">Upload and manage course materials</p>
          </a>
          <a
            href="/admin/dashboard/notice"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
          >
            <Bell className="text-purple-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Manage Notices</h3>
            <p className="text-sm text-gray-600">Create and publish notices</p>
          </a>
          <a
            href="/admin/dashboard/users"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200"
          >
            <Users className="text-green-600 mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage user accounts</p>
          </a>
        </div>
      </div>
    </div>
  );
}
