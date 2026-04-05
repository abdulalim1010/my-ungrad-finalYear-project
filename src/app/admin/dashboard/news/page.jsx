"use client";

import { useEffect, useState } from "react";
import { Newspaper, Trash2, Edit, Plus, X, Search, Eye, Image as ImageIcon } from "lucide-react";
import { showSuccess, showError, showWarning } from "@/utils/swal";
import Image from "next/image";

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "", category: "", image: "" });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? "/api/news" : "/api/news";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { _id: editingItem._id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showSuccess(editingItem ? "News updated!" : "News created!");
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: "", description: "", category: "", image: "" });
        fetchNews();
      } else {
        showError("Failed to save news");
      }
    } catch (err) {
      showError("Error saving news");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this news item?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showSuccess("News deleted!");
        fetchNews();
      } else {
        showError("Failed to delete");
      }
    } catch (err) {
      showError("Error deleting news");
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category || "",
      image: item.image || "",
    });
    setShowModal(true);
  };

  const filteredNews = news.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ["Notice", "Event", "Seminar", "Workshop", "Research", "Achievement", "General"];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Newspaper className="text-blue-600" />
            Department News & Events
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage news and announcements</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditingItem(null); setFormData({ title: "", description: "", category: "", image: "" }); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add News
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No news found</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
              <div className="relative h-40 bg-gray-100">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-gray-400" size={40} />
                  </div>
                )}
                {item.category && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Eye size={14} />
                    <span>{item.views || 0}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">{editingItem ? "Edit News" : "Add New News"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingItem ? "Update News" : "Create News"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}