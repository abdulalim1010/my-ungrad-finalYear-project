// src/app/teachers/page.jsx
import Link from "next/link";
import clientPromise from "@/lib/mongodb";

export default async function TeachersPage() {
  const client = await clientPromise;
  const db = client.db("departmentDB");

  const teachers = await db.collection("teachers").find({}).toArray();

  return (
    <div className="max-w-7xl mt-50 mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          Meet Our Faculty
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our highly qualified teaching staff in the Electrical & Electronic Engineering Department.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((teacher) => (
          <Link key={teacher._id.toString()} href={`/teachers/${teacher._id.toString()}`}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-blue-700 mb-1">{teacher.name}</h2>
                <p className="text-gray-600 mb-1">{teacher.designation}</p>
                <p className="text-gray-500 mb-4">{teacher.department}</p>
                <button className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition-all duration-300 transform hover:scale-105">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
