"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, Edit2, Trash2, Globe, Award, X, Check, Search } from "lucide-react";
import { showSuccess, showError, showDeleteConfirm } from "@/utils/swal";

export default function TeachersManagementPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "Electrical & Electronic Engineering",
    email: "",
    phone: "",
    image: "",
    bio: "",
    isHOD: false,
    isAbroad: false,
    abroadCountry: "",
    abroadUniversity: "",
    isPhD: false,
    phdField: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTeacher 
        ? `/api/teachers?id=${editingTeacher._id}`
        : "/api/teachers";
      
      const method = editingTeacher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showSuccess(editingTeacher ? "Teacher updated successfully!" : "Teacher added successfully!");
        setShowModal(false);
        resetForm();
        fetchTeachers();
      } else {
        showError("Failed to save teacher");
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      showError("Error saving teacher");
    }
  };

  const handleDelete = async (id) => {
    const result = await showDeleteConfirm("Delete Teacher", "Are you sure you want to delete this teacher?");
    if (!result.isConfirmed) return;
    
    try {
      const res = await fetch(`/api/teachers?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        showSuccess("Teacher deleted successfully!");
        fetchTeachers();
      } else {
        showError("Failed to delete teacher");
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      designation: teacher.designation || "",
      department: teacher.department || "Electrical & Electronic Engineering",
      email: teacher.email || "",
      phone: teacher.phone || "",
      image: teacher.image || "",
      bio: teacher.bio || "",
      isHOD: teacher.isHOD || false,
      isAbroad: teacher.isAbroad || false,
      abroadCountry: teacher.abroadCountry || "",
      abroadUniversity: teacher.abroadUniversity || "",
      isPhD: teacher.isPhD || false,
      phdField: teacher.phdField || "",
    });
    setShowModal(true);
  };

  const toggleHOD = async (teacher) => {
    // First, remove HOD from all other teachers
    const updatedTeachers = teachers.map(t => {
      if (t._id !== teacher._id && t.isHOD) {
        return { ...t, isHOD: false };
      }
      return t;
    });

    // Then set the new HOD
    try {
      const res = await fetch(`/api/teachers?id=${teacher._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHOD: !teacher.isHOD }),
      });

      if (res.ok) {
        fetchTeachers();
      }
    } catch (error) {
      console.error("Error updating HOD status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      department: "Electrical & Electronic Engineering",
      email: "",
      phone: "",
      image: "",
      bio: "",
      isHOD: false,
      isAbroad: false,
      abroadCountry: "",
      abroadUniversity: "",
      isPhD: false,
      phdField: "",
    });
    setEditingTeacher(null);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "hod") return matchesSearch && teacher.isHOD;
    if (filterType === "abroad") return matchesSearch && teacher.isAbroad;
    if (filterType === "phd") return matchesSearch && teacher.isPhD;
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty teachers and their roles</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Teachers</option>
          <option value="hod">HOD Only</option>
          <option value="abroad">Abroad for PhD</option>
          <option value="phd">Has PhD</option>
        </select>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
                teacher.isHOD ? "border-amber-400" : "border-transparent"
              }`}
            >
              {/* Header with gradient */}
              <div className={`h-24 ${teacher.isHOD ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}>
                {teacher.isHOD && (
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-full">
                      HOD
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Image */}
              <div className="relative px-6">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <div className={`w-24 h-24 rounded-full p-1 ${teacher.isHOD ? "bg-amber-400" : "bg-white"} shadow-lg`}>
                    <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={teacher.image || "/default-teacher.jpg"}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{teacher.designation}</p>
                <p className="text-gray-500 text-sm mt-1">{teacher.department}</p>

                {/* Status Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {teacher.isAbroad && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <Globe size={12} />
                      Abroad
                    </span>
                  )}
                  {teacher.isPhD && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      <Award size={12} />
                      PhD
                    </span>
                  )}
                  {teacher.isAbroad && teacher.abroadCountry && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {teacher.abroadCountry}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => toggleHOD(teacher)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      teacher.isHOD
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {teacher.isHOD ? "✓ HOD" : "Set HOD"}
                  </button>
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTeachers.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <GraduationCap size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No teachers found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Professor & Head, Associate Professor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Special Flags */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isHOD"
                      checked={formData.isHOD}
                      onChange={(e) => setFormData({ ...formData, isHOD: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <label htmlFor="isHOD" className="text-sm font-medium text-gray-700">
                      Head of Department (HOD)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isAbroad"
                      checked={formData.isAbroad}
                      onChange={(e) => setFormData({ ...formData, isAbroad: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <label htmlFor="isAbroad" className="text-sm font-medium text-gray-700">
                      Currently Abroad for PhD
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPhD"
                      checked={formData.isPhD}
                      onChange={(e) => setFormData({ ...formData, isPhD: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <label htmlFor="isPhD" className="text-sm font-medium text-gray-700">
                      Has PhD
                    </label>
                  </div>
                </div>

                {/* Conditional Fields */}
                {formData.isAbroad && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-green-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.abroadCountry}
                        onChange={(e) => setFormData({ ...formData, abroadCountry: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., USA, UK, Canada"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <input
                        type="text"
                        value={formData.abroadUniversity}
                        onChange={(e) => setFormData({ ...formData, abroadUniversity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="University name"
                      />
                    </div>
                  </div>
                )}

                {formData.isPhD && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PhD Field
                    </label>
                    <input
                      type="text"
                      value={formData.phdField}
                      onChange={(e) => setFormData({ ...formData, phdField: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Power Systems, Electronics"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                >
                  {editingTeacher ? "Update Teacher" : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}