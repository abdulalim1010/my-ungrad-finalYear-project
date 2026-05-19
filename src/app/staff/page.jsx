import { clientPromise } from "@/lib/mongodb";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  let staff = [];
  let registrar = null;
  
  try {
    if (!clientPromise) {
      throw new Error("Database not configured");
    }
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const allStaff = await db.collection("staff").find({}).toArray();
    
    // Sort staff: isRegister first, then primary keywords, then others
    const sortedStaff = [...allStaff].sort((a, b) => {
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
    
    // Separate registrar from other staff
    registrar = sortedStaff.find(t => t.isRegister);
    staff = sortedStaff.filter(t => !t.isRegister);
    
  } catch (error) {
    console.log("Staff collection not found or empty");
  }

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
            Staff Members of EEE Department
          </h1>
          <p className="text-white font-bold text-xl max-w-3xl mx-auto">
            Our dedicated administrative and support staff members
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* If there's a registrar or staff */}
        {(staff.length > 0 || registrar) ? (
          <div>
            {/* ===== REGISTRAR SPECIAL CARD ===== */}
            {registrar && (
              <div className="mb-20">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-800">All Member of the Offical Staff</h2>
                  <div className="h-1 w-28 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mt-3"></div>
                </div>
                <div className="flex justify-center">
                  <Link
                    key={registrar._id.toString()}
                    href={`/staff/${registrar._id.toString()}`}
                    className="group"
                  >
                    <div
                      className="relative bg-white rounded-3xl shadow-2xl overflow-hidden
                                 hover:-translate-y-3 hover:shadow-3xl transition-all duration-500
                                 border-2 border-amber-400 max-w-md"
                    >
                      {/* ===== TOP GRADIENT STRIP (Gold for Registrar) ===== */}
                      <div className="h-32 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

                      {/* ===== SPECIAL REGISTRAR BADGE ===== */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-4 py-1.5 rounded-full bg-amber-400 text-white text-sm font-bold shadow-lg">
                          REGISTRAR
                        </span>
                      </div>

                      {/* ===== CIRCLE IMAGE (Larger for Registrar) ===== */}
                      <div className="absolute top-16 left-1/2 -translate-x-1/2">
                        <div
                          className="w-40 h-40 rounded-full bg-white p-3 shadow-2xl
                                     group-hover:scale-105 transition-transform duration-300 border-4 border-amber-400"
                        >
                          <img
                            src={registrar.image || "/globe.svg"}
                            alt={registrar.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>

                      {/* ===== CARD CONTENT ===== */}
                      <div className="pt-28 pb-10 px-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {registrar.name}
                        </h2>

                        {/* DESIGNATION BADGE */}
                        <span
                          className="inline-block mt-2 px-6 py-2 rounded-full
                                     bg-amber-100 text-amber-700 text-base font-bold"
                        >
                          {registrar.designation}
                        </span>

                        <p className="text-gray-500 mt-4 mb-2 text-lg">
                          {registrar.department || "EEE Department"}
                        </p>

                        {/* Phone */}
                        {registrar.phone && (
                          <p className="text-gray-600 text-base mb-4">
                            📞 {registrar.phone}
                          </p>
                        )}

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

            {/* ===== OTHER STAFF GRID ===== */}
            {staff.length > 0 && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-800">Other Staff Members</h2>
                  <div className="h-1 w-36 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mt-3"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {staff.map((member) => (
                    <Link
                      key={member._id.toString()}
                      href={`/staff/${member._id.toString()}`}
                      className="group"
                    >
                      <div
                        className="relative bg-white rounded-3xl shadow-xl overflow-hidden
                                   hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                      >
                        {/* ===== TOP GRADIENT STRIP ===== */}
                        <div className="h-28 bg-gradient-to-r from-green-600 via-green-500 to-teal-600" />

                        {/* ===== CIRCLE IMAGE ===== */}
                        <div className="absolute top-14 left-1/2 -translate-x-1/2">
                          <div
                            className="w-32 h-32 rounded-full bg-white p-2 shadow-xl
                                       group-hover:scale-105 transition-transform duration-300"
                          >
                            <img
                              src={member.image || "/globe.svg"}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        </div>

                        {/* ===== CARD CONTENT ===== */}
                        <div className="pt-26 pb-10 px-8 text-center">
                          <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {member.name}
                          </h2>

                          {/* DESIGNATION BADGE */}
                          <span
                            className="inline-block mt-2 px-5 py-1.5 rounded-full
                                       bg-green-100 text-green-700 text-sm font-semibold"
                          >
                            {member.designation}
                          </span>

                          <p className="text-gray-500 mt-4 mb-2 text-base">
                            {member.department || "EEE Department"}
                          </p>

                          {/* Phone Number */}
                          {member.phone && (
                            <p className="text-gray-600 text-base mb-4">
                              📞 {member.phone}
                            </p>
                          )}

                          {/* BUTTON */}
                          <button
                            className="px-8 py-3 rounded-full
                                       bg-gradient-to-r from-green-600 to-teal-600
                                       text-white font-semibold
                                       hover:from-green-700 hover:to-teal-700
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
                                     bg-gradient-to-tr from-green-500/10 to-teal-500/10"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ===== NO STAFF MESSAGE ===== */
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Staff Directory Coming Soon</h2>
              <p className="text-gray-600 text-lg">
                We are currently updating our staff directory. Please check back later or contact the department office for assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}