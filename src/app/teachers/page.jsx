import Link from "next/link";
import { clientPromise } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export default async function TeachersPage() {
  let teachers = [];
  let hod = null;
  
  try {
    if (!clientPromise) {
      throw new Error("Database not configured");
    }
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    teachers = await db.collection("teachers").find({}).toArray();
  } catch (error) {
    console.log("Teachers collection not found or empty");
  }

  // Sort teachers: Head of Department first (using isHOD flag), then others
  const sortedTeachers = [...teachers].sort((a, b) => {
    // First priority: isHOD flag from database
    if (a.isHOD && !b.isHOD) return -1;
    if (!a.isHOD && b.isHOD) return 1;
    
    // Secondary: fallback to designation text check
    const aDesignation = (a.designation || "").toLowerCase();
    const bDesignation = (b.designation || "").toLowerCase();
    
    const aIsHOD = aDesignation.includes("head") || aDesignation.includes("hod") || aDesignation.includes("chair");
    const bIsHOD = bDesignation.includes("head") || bDesignation.includes("hod") || bDesignation.includes("chair");
    
    if (aIsHOD && !bIsHOD) return -1;
    if (!aIsHOD && bIsHOD) return 1;
    return 0;
  });

  // Separate HOD from other teachers using isHOD flag
  hod = sortedTeachers.find(t => t.isHOD);
  const otherTeachers = sortedTeachers.filter(t => !t.isHOD);

  return (
    <div className="w-full">
      {/* ================= HERO / HEADER ================= */}
      <div
        className="relative h-[420px] w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/department.jpg')",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/30" />

        {/* HEADER CONTENT */}
        <div className="relative z-10 text-center px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
             Faculty Members of EEE Department
          </h1>
          <p className="text-white font-bold text-xl max-w-3xl mx-auto">
            Dedicated, experienced and highly qualified faculty members of the
            Electrical & Electronic Engineering Department
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* ===== HOD SPECIAL CARD ===== */}
        {hod && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Head of Department</h2>
              <div className="h-1 w-28 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mt-3"></div>
            </div>
            <div className="flex justify-center">
              <Link
                key={hod._id.toString()}
                href={`/teachers/${hod._id.toString()}`}
                className="group"
              >
                <div
                  className="relative bg-white rounded-3xl shadow-2xl overflow-hidden
                             hover:-translate-y-3 hover:shadow-3xl transition-all duration-500
                             border-2 border-amber-400"
                >
                  {/* ===== TOP GRADIENT STRIP (Gold for HOD) ===== */}
                  <div className="h-32 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

                  {/* ===== SPECIAL HOD BADGE ===== */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-amber-400 text-white text-sm font-bold shadow-lg">
                      HOD
                    </span>
                  </div>

                  {/* ===== CIRCLE IMAGE (Larger for HOD) ===== */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2">
                    <div
                      className="w-40 h-40 rounded-full bg-white p-3 shadow-2xl
                                 group-hover:scale-105 transition-transform duration-300 border-4 border-amber-400"
                    >
                      <img
                        src={hod.image}
                        alt={hod.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* ===== CARD CONTENT ===== */}
                  <div className="pt-28 pb-10 px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {hod.name}
                    </h2>

                    {/* DESIGNATION BADGE */}
                    <span
                      className="inline-block mt-2 px-6 py-2 rounded-full
                                 bg-amber-100 text-amber-700 text-base font-bold"
                    >
                      {hod.designation}
                    </span>

                    <p className="text-gray-500 mt-4 mb-6 text-lg">
                      {hod.department}
                    </p>

                    {/* BUTTON */}
                    <button
                      className="px-8 py-3 rounded-full
                                 bg-gradient-to-r from-amber-500 to-amber-600
                                 text-white font-semibold text-lg
                                 hover:from-amber-600 hover:to-amber-700
                                 transition-all duration-300 shadow-lg
                                 group-hover:scale-105"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* ===== GLOW EFFECT ===== */}
                  <div
                    className="absolute inset-0 rounded-3xl
                               opacity-0 group-hover:opacity-100
                               transition duration-500
                               bg-gradient-to-tr from-amber-500/10 to-amber-600/10"
                  />
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ===== OTHER TEACHERS GRID ===== */}
        {otherTeachers.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Other Faculty Members</h2>
              <div className="h-1 w-36 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-3"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {otherTeachers.map((teacher) => (
                <Link
                  key={teacher._id.toString()}
                  href={`/teachers/${teacher._id.toString()}`}
                  className="group"
                >
                  <div
                    className="relative bg-white rounded-3xl shadow-xl overflow-hidden
                               hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                  >
                    {/* ===== TOP GRADIENT STRIP ===== */}
                    <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />

                    {/* ===== CIRCLE IMAGE ===== */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2">
                      <div
                        className="w-32 h-32 rounded-full bg-white p-2 shadow-xl
                                   group-hover:scale-105 transition-transform duration-300"
                      >
                        <img
                          src={teacher.image}
                          alt={teacher.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* ===== CARD CONTENT ===== */}
                    <div className="pt-26 pb-10 px-8 text-center">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {teacher.name}
                      </h2>

                      {/* DESIGNATION BADGE */}
                      <span
                        className="inline-block mt-2 px-5 py-1.5 rounded-full
                                   bg-blue-100 text-blue-700 text-sm font-semibold"
                      >
                        {teacher.designation}
                      </span>

                      <p className="text-gray-500 mt-4 mb-6 text-base">
                        {teacher.department}
                      </p>

                      {/* BUTTON */}
                      <button
                        className="px-8 py-3 rounded-full
                                   bg-gradient-to-r from-blue-600 to-indigo-600
                                   text-white font-semibold
                                   hover:from-blue-700 hover:to-indigo-700
                                   transition-all duration-300 shadow-md
                                   group-hover:scale-105"
                      >
                        View Profile
                      </button>
                    </div>

                    {/* ===== GLOW EFFECT ===== */}
                    <div
                      className="absolute inset-0 rounded-3xl
                                 opacity-0 group-hover:opacity-100
                                 transition duration-500
                                 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
