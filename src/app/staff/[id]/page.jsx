import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";

// Animate-on-load utility
function FadeInWrapper({ children, className }) {
  return (
    <div
      className={`opacity-0 translate-y-6 animate-fadeIn ${className || ""}`}
      style={{
        animation: 'fadeIn 1.2s cubic-bezier(.5,1,.3,1) forwards',
      }}
    >
      {children}
      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default async function StaffDetail(props) {
  const { id } = await props.params;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return <div className="text-red-500 p-10">Invalid ID</div>;
  }

  const staff = await db.collection("staff").findOne({ _id: objectId });

  if (!staff) {
    return <div className="text-red-500 p-10">Staff member not found</div>;
  }

  return (
    <div className="w-full bg-[#F5F7FB] pb-24">

      {/* HEADER BG IMAGE */}
      <div className="relative w-full h-[350px] lg:h-[380px] flex items-end">
        <img
          src="/department.jpg"
          alt="Department background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#059669db] via-[#059669a2] to-[#f5f7fb00] opacity-90"></div>

        <FadeInWrapper className="relative max-w-7xl mx-auto px-6 pb-10 z-10 w-full">
          <Link
            href="/staff"
            className="text-white font-semibold bg-green-700 bg-opacity-60 hover:bg-opacity-80 transition rounded-md px-4 py-2 inline-block shadow-lg"
          >
            ← Back
          </Link>

        </FadeInWrapper>
      </div>

      {/* PROFILE + INFO */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-14">
          {/* IMAGE CARD W/ ANIMATION */}
          <FadeInWrapper className="w-full lg:w-1/3">
            <div className="relative group rounded-xl overflow-hidden shadow-xl transition hover:scale-105 duration-500">
              <img
                src={staff.image || "/globe.svg"}
                alt={`${staff.name} photo`}
                className="w-full h-[450px] object-cover rounded-xl transition duration-700 scale-100 group-hover:scale-110"
              />
              <div className="text-center mb-5">
                <h1 className="mt-8 text-3xl font-extrabold text-black drop-shadow-lg">{staff.name}</h1>
                <p className="text-2xl text-black mt-4">{staff.designation}</p>
                <span className="text-green-600 mt-4 mb-5 font-bold text-lg block">{staff.department || "EEE Department"}</span>
              </div>
            </div>
          </FadeInWrapper>

          {/* Info */}
          <FadeInWrapper className="flex-1">
            <div className="mt-1 text-lg text-gray-600">
              {staff.email && (
                <p><strong>Email:</strong> <span className="text-green-700">{staff.email}</span></p>
              )}
              {staff.phone && (
                <p><strong>Phone:</strong> <span className="text-green-700">{staff.phone}</span></p>
              )}
              {staff.office && (
                <p><strong>Office:</strong> <span className="text-green-700">{staff.office}</span></p>
              )}
            </div>
            {/* BIO */}
            {staff.bio && (
              <p className="mt-8 text-gray-800 text-[18px] leading-8">{staff.bio}</p>
            )}
            {/* Duties/Services if any */}
            {staff.duties && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-green-800 mb-4">Duties & Responsibilities</h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700 text-[16px] leading-7">
                  {staff.duties.map((duty, i) => (
                    <li key={i}>{duty}</li>
                  ))}
                </ul>
              </div>
            )}
          </FadeInWrapper>
        </div>
      </div>

      {/* MAP */}
      <div className="max-w-7xl mx-auto mt-20 px-6">
        <FadeInWrapper>
          <section id="office">
            <h2 className="text-3xl font-bold mb-5 text-green-900">Office Location</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED&zoom=17"
              className="w-full h-[420px] rounded-xl"
            ></iframe>
          </section>
        </FadeInWrapper>
      </div>
    </div>
  );
}