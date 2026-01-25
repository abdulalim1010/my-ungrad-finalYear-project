"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  /* =====================
      FETCH ADMIN INFO
  ====================== */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || data.role !== "admin") {
          router.replace("/unauthorized");
          return;
        }

        setUser(data);
      } catch (err) {
        setError("Failed to load admin info");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [router]);

  /* =====================
        LOGOUT
  ====================== */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading admin settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">⚙️ Admin Settings</h1>

      {user && (
  <div className="bg-white rounded shadow p-6 space-y-3">
    <h2 className="text-xl font-semibold">👤 Profile</h2>

    <p>
      <b>Name:</b> {user.name || "admin"}
    </p>
    <p>
      <b>Email:</b> {user.email}
    </p>
    <p>
      <b>Role:</b>{" "}
      <span className="text-green-600 font-semibold">
        {user.role}
      </span>
    </p>
  </div>
)}


      {/* ================= SECURITY ================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">🔐 Security</h2>

        <button
          onClick={() => router.push("/admin/change-password")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </div>

      {/* ================= SYSTEM ================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">🛠 System</h2>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
