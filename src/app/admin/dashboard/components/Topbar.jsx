"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch admin user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 border-b border-gray-200">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <User size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user.name || user.email}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
