"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, X, Search } from "lucide-react";

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "Electrical & Electronic Engineering",
    email: "",
    phone: "",
    image: "",
    joinDate: "",
    isRegister: false,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      
      // Sort staff: isRegister first, then primary keywords, then others
      const sortedStaff = [...data].sort((a, b) => {
        // First priority: isRegister flag
        if (a.isRegister && !b.isRegister) return -1;
        if (!a.isRegister && b.isRegister) return 1;
        
        // Secondary: fallback to designation keywords
        const aDes = (a.designation || "").toLowerCase();
        const bDes = (b.designation || "").toLowerCase();
        
        const primaryKeywords = ["register", "registrar", "head", "director", "manager", "officer", "chief", "supervisor"];
        
        const aIsPrimary = primaryKeywords.some(kw => aDes.includes(kw));
        const bIsPrimary = primaryKeywords.some(kw => bDes.includes(kw));
        
        if (aIsPrimary && !bIsPrimary) return -1;
        if (!aIsPrimary && bIsPrimary) return 1;
        return 0;
      });
      
      setStaff(sortedStaff); // Show ALL staff including registrar in grid
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingStaff 
        ? `/api/staff?id=${editingStaff._id.toString()}`
        : "/api/staff";
      
      const method = editingStaff ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingStaff ? "Staff updated successfully!" : "Staff member added successfully!");
        setShowModal(false);
        resetForm();
        fetchStaff();
      } else {
        alert("Failed to save staff");
      }
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("Error saving staff");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    try {
      const res = await fetch(`/api/staff?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Staff member deleted successfully!");
        fetchStaff();
      } else {
        alert("Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      department: member.department || "Electrical & Electronic Engineering",
      email: member.email || "",
      phone: member.phone || "",
      image: member.image || "",
      joinDate: member.joinDate || "",
      isRegister: member.isRegister || false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      department: "Electrical & Electronic Engineering",
      email: "",
      phone: "",
      image: "",
      joinDate: "",
      isRegister: false,
    });
    setEditingStaff(null);
  };

  const filteredStaff = staff.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage departmental staff members</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-emerald-400 transition-all hover:shadow-xl"
            >
              {/* Header with gradient */}
              <div className={`h-20 ${member.isRegister ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`} />

              {/* Profile Image */}
              <div className="relative px-6">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg">
                    <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={member.image || "/default-staff.jpg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 pb-6 px-6 text-center">
                {member.isRegister && (
                  <span className="inline-block mb-2 px-3 py-1 rounded-full bg-amber-400 text-white text-xs font-bold">
                    REGISTRAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-emerald-600 font-medium mt-1">{member.designation}</p>
                <p className="text-gray-500 text-sm mt-1">{member.department}</p>

                {member.email && (
                  <p className="text-gray-400 text-sm mt-2">{member.email}</p>
                )}

                {member.phone && (
                  <p className="text-gray-600 text-sm mt-2">📞 {member.phone}</p>
                )}

                {member.joinDate && (
                  <p className="text-gray-400 text-xs mt-2">
                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 py-2 px-3 bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-all"
                  >
                    <Edit2 size={16} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
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

      {filteredStaff.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No staff members found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Lab Technician, Admin Officer"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Is Register Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  id="isRegister"
                  checked={formData.isRegister}
                  onChange={(e) => setFormData({ ...formData, isRegister: e.target.checked })}
                  className="w-5 h-5 text-amber-600 rounded"
                />
                <label htmlFor="isRegister" className="text-sm font-medium text-gray-700">
                  Mark as Registrar / Register (Will appear as special card at top)
                </label>
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
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
                >
                  {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}