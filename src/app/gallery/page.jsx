import { clientPromise } from "@/lib/mongodb";
import Link from "next/link";

export default async function GalleryPage() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const items = await db
    .collection("student_gallery")
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .toArray();

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

      {/* ================= GRID ================= */}
      <div className="max-w-7xl mx-auto px-6">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            No gallery items available yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => (
              <div
                key={item._id.toString()}
                className="
                  group relative bg-white rounded-3xl overflow-hidden
                  shadow-xl hover:shadow-2xl
                  transition-all duration-500
                  hover:-translate-y-3
                "
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="
                      w-full h-64 object-cover
                      group-hover:scale-110 transition-transform duration-700
                    "
                  />

                  {/* IMAGE OVERLAY */}
                  <div
                    className="
                      absolute inset-0 bg-gradient-to-t
                      from-black/60 via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-500
                    "
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-gray-400 italic">
                      — {item.studentName}
                    </span>

                    <span
                      className="
                        text-xs px-3 py-1 rounded-full
                        bg-blue-100 text-blue-700 font-semibold
                      "
                    >
                      Student Work
                    </span>
                  </div>
                </div>

                {/* GLOW EFFECT */}
                <div
                  className="
                    absolute inset-0 rounded-3xl
                    opacity-0 group-hover:opacity-100
                    transition duration-500
                    bg-gradient-to-tr from-blue-500/10 to-indigo-500/10
                  "
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
