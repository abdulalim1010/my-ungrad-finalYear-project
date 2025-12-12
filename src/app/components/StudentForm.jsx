"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function StudentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    session: "2010-2011",
    year: "1",
    email: "",
    address: "",
    district: "",
  });

  const sessions = [];
  for (let y = 2010; y <= 2024; y++) sessions.push(`${y}-${y + 1}`);

  const years = ["1", "2", "3", "4"];

  const districts = [
    "Dhaka",
    "Chittagong",
    "Khulna",
    "Rajshahi",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Are all your information correct?",
      text: "Please check everything before submitting.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    onSubmit(formData);

    Swal.fire({
      title: "Success!",
      text: "Your student data has been submitted successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    setFormData({
      name: "",
      studentId: "",
      session: "2010-2011",
      year: "1",
      email: "",
      address: "",
      district: "",
    });
  };

  return (
    <div className="p-10  bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100">

      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center tracking-wide">
        Add Student (EEE)
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-7">

        {/* Name */}
        <div>
          <label className="inputLabel">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            onChange={handleChange}
            value={formData.name}
            className="inputField"
            required
          />
        </div>

        {/* Student ID */}
        <div>
          <label className="inputLabel">Student ID</label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter Student ID"
            onChange={handleChange}
            value={formData.studentId}
            className="inputField"
            required
          />
        </div>

        {/* Session */}
        <div>
          <label className="inputLabel">Session</label>
          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
            className="inputField"
          >
            {sessions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="inputLabel">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="inputField"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="inputLabel">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            onChange={handleChange}
            value={formData.email}
            className="inputField"
            required
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="inputLabel">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
            value={formData.address}
            className="inputField"
            required
          />
        </div>

        {/* District */}
        <div className="md:col-span-2">
          <label className="inputLabel">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="inputField"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:scale-[1.02]"
          >
            Save Student
          </button>
        </div>

      </form>
    </div>
  );
}
