"use client";

import { useEffect, useState } from "react";
import { Bell, Upload, Edit, Trash2, X, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react";

export default function AdminNoticePage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const loadNotices = async () => {
    try {
      const res = await fetch("/api/notices", { cache: "no-store" });
      const data = await res.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notices:", err);
      setNotices([]);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const uploadFileToCloudinary = async () => {
    if (!file) return fileUrl || null;
    setLoadingUpload(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "notices_upload");
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxbkaeshc");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxbkaeshc"}/auto/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      setLoadingUpload(false);

      if (!res.ok) {
        console.error("Cloudinary Error:", data);
        setUploadError("File upload failed. Please try again.");
        return null;
      }

      return data.secure_url;
    } catch (err) {
      console.error("Upload Error:", err);
      setUploadError("File upload failed. Please try again.");
      setLoadingUpload(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess(false);

    if (!title || !description) {
      setUploadError("Please fill in all required fields");
      return;
    }

    const uploadedUrl = await uploadFileToCloudinary();

    try {
      const method = editId ? "PUT" : "POST";
      const res = await fetch("/api/notices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title,
          description,
          fileUrl: uploadedUrl || fileUrl,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save notice");

      setTitle("");
      setDescription("");
      setFile(null);
      setFileName("");
      setFileUrl("");
      setEditId(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      loadNotices();
    } catch (err) {
      setUploadError("Failed to save notice. Please try again.");
    }
  };

  const handleEdit = (notice) => {
    setEditId(notice._id);
    setTitle(notice.title);
    setDescription(notice.description);
    setFileUrl(notice.fileUrl || "");
    setFile(null);
    setFileName("");
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setFile(null);
    setFileName("");
    setFileUrl("");
    setUploadError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const res = await fetch("/api/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete notice");
      loadNotices();
    } catch (err) {
      alert("Failed to delete notice. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileUrl(""); // Clear existing URL when new file is selected
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Bell className="text-blue-600" size={32} />
          Manage Notices
        </h1>
        <p className="text-gray-600 mt-2">Create and manage department notices</p>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {editId ? "Edit Notice" : "Create New Notice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Notice {editId ? "updated" : "created"} successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notice Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter notice description"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attach File (Optional)
            </label>
            {fileName ? (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-gray-700 font-medium">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileName("");
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : fileUrl ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-gray-700 font-medium">Existing file attached</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileUrl("")}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, Images, Documents (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </label>
            )}
            {loadingUpload && (
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Uploading file...
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loadingUpload}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {editId ? (
                <>
                  <Edit size={20} />
                  <span>Update Notice</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Create Notice</span>
                </>
              )}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notices List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Notices</h2>
        {notices.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Bell className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-600 text-lg">No notices created yet</p>
            <p className="text-gray-500 text-sm mt-2">Create your first notice using the form above</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((n) => (
              <div
                key={n._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{n.title}</h3>
                    <p className="text-gray-600 mb-3">{n.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>{new Date(n.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</span>
                    </div>
                  </div>
                </div>

                {n.fileUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <a
                      href={n.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <FileText size={18} />
                      <span>View Attached File</span>
                    </a>
                  </div>
                )}

                <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(n)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition font-medium"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
