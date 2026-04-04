"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Shield, Mail, Loader2, Edit } from "lucide-react";
import { showSuccess, showError } from "@/utils/swal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Update role
  const updateRole = async (id, role) => {
    if (!confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
    
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      showSuccess("Role updated successfully");
      await fetchUsers(); // refresh list
    } catch (error) {
      console.error(error);
      showError("Role update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="text-purple-600" size={20} />;
      case "student":
        return <UserCheck className="text-green-600" size={20} />;
      default:
        return <Users className="text-blue-600" size={20} />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "student":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-blue-600" size={32} />
          User Management
        </h1>
        <p className="text-gray-600 mt-2">Manage user accounts and roles</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-gray-900">{user.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role?.toUpperCase() || "USER"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.role === "user" && (
                            <button
                              disabled={updatingId === user._id}
                              onClick={() => updateRole(user._id, "student")}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                            >
                              {updatingId === user._id ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <UserCheck size={16} />
                              )}
                              Make Student
                            </button>
                          )}

                          {user.role === "student" && (
                            <button
                              disabled={updatingId === user._id}
                              onClick={() => updateRole(user._id, "user")}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                            >
                              {updatingId === user._id ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <Edit size={16} />
                              )}
                              Remove Student
                            </button>
                          )}

                          {user.role === "admin" && (
                            <span className="text-gray-400 font-medium text-sm flex items-center gap-2">
                              <Shield size={16} />
                              Admin Account
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleIcon(user.role)}
                    {user.role?.toUpperCase() || "USER"}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  {user.role === "user" && (
                    <button
                      disabled={updatingId === user._id}
                      onClick={() => updateRole(user._id, "student")}
                      className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      {updatingId === user._id ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={18} />
                          <span>Make Student</span>
                        </>
                      )}
                    </button>
                  )}

                  {user.role === "student" && (
                    <button
                      disabled={updatingId === user._id}
                      onClick={() => updateRole(user._id, "user")}
                      className="w-full py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      {updatingId === user._id ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Edit size={18} />
                          <span>Remove Student</span>
                        </>
                      )}
                    </button>
                  )}

                  {user.role === "admin" && (
                    <div className="text-center py-2 text-gray-500 text-sm flex items-center justify-center gap-2">
                      <Shield size={18} />
                      <span>Admin Account - No actions available</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Users className="text-gray-400 mx-auto mb-4" size={64} />
              <p className="text-xl text-gray-600">No users found</p>
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Try adjusting your search" : "Users will appear here"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
