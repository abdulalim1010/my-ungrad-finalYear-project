"use client";

import StudentForm from "../components/StudentForm";

export default function PublicStudentsPage() {
  const handleFormSubmit = async (data) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit data");

      alert("Your information has been submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 pb-20">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Begum Rokeya University, Rangpur
      </h1>

      <p className="text-center text-gray-700 mb-8">
        Please add your correct information. This is only for the department office.
      </p>

      <StudentForm onSubmit={handleFormSubmit} />
    </div>
  );
}
