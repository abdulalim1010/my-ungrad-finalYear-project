"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/components/firebase";
import { User } from "lucide-react";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
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
            <span className="text-sm font-medium text-gray-700">{user.email}</span>
          </div>
        </div>
      )}
    </header>
  );
}
