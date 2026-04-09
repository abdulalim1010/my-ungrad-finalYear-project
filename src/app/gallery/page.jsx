import { clientPromise } from "@/lib/mongodb";
import Link from "next/link";
import GalleryContent from "./components/GalleryContent";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let allItems = [];
  
  try {
    if (!clientPromise) {
      throw new Error("Database not configured");
    }
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const rawItems = await db
      .collection("student_gallery")
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();
    
    allItems = rawItems.map(item => ({
      ...item,
      _id: item._id.toString(),
    }));
  } catch (error) {
    console.log("Gallery collection not found or empty");
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-24">

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
          Student Gallery
        </h1>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          Moments, memories and proud contributions shared by our department students
        </p>

        <Link
          href="/gallery/submit"
          className="
            inline-flex items-center gap-2 mt-8 px-8 py-4
            bg-gradient-to-r from-blue-700 to-indigo-700
            text-white font-semibold rounded-full
            shadow-lg hover:shadow-xl
            hover:scale-105 transition-all duration-300
          "
        >
          If you are a member of the department
        </Link>
      </div>

      <GalleryContent items={allItems} />
    </div>
  );
}
