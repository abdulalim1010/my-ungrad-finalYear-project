import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";

// Animate-on-load utility (for SSR you might want to hydrate with useEffect in client components)
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

export default async function TeacherDetail(props) {
  const { id } = await props.params;

  if (!clientPromise) {
    return <div className="text-center p-10">Database not configured</div>;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return <div className="text-red-500 p-10">Invalid ID</div>;
  }

  const teacher = await db.collection("teachers").findOne({ _id: objectId });

  if (!teacher) {
    return <div className="text-red-500 p-10">Teacher not found</div>;
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#143066db] via-[#143066a2] to-[#f5f7fb00] opacity-90"></div>

        <FadeInWrapper className="relative max-w-7xl mx-auto px-6 pb-10 z-10 w-full">
          <Link
            href="/teachers"
            className="text-white font-semibold bg-blue-700 bg-opacity-60 hover:bg-opacity-80 transition rounded-md px-4 py-2 inline-block shadow-lg"
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
                src={teacher.image}
                alt={`${teacher.name} photo`}
                className="w-full h-[450px] object-cover rounded-xl transition duration-700 scale-100 group-hover:scale-110"
              />   
              <div className="text-center mb-5"><h1 className="mt-8 text-3xl font-extrabold text-black drop-shadow-lg">{teacher.name}</h1>
                <p className="text-2xl text-black mt-4">{teacher.designation}</p>
              
              <span className="text-shadow-blue-500 mt-4 mb-5  font-bold  text-lg">{teacher.department}</span>
              </div>
              
                
             
            </div>
          </FadeInWrapper>

          {/* Info */}
          <FadeInWrapper className="flex-1">
            <div className="mt-1 text-lg text-gray-600">
              <p><strong>Email:</strong> <span className="text-blue-700">{teacher.email}</span></p>
              <p><strong>Phone:</strong> <span className="text-blue-700">{teacher.phone}</span></p>
            </div>
            {/* BIO */}
            <p className="mt-8 text-gray-800 text-[18px] leading-8">{teacher.bio}</p>
            {/* BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
              {[
                ["education", "Education"],
                ["experience", "Experience"],
                ["researchActivities", "Research Activities"],
                ["publications", "Publications"],
                ["awards", "Awards"],
                ["membership", "Membership"],
              ].map(([key, label]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="
                    group relative px-3 py-[10px] text-center border text-[15px]
                    font-medium rounded-lg min-h-[45px]
                    bg-white
                    overflow-hidden
                    shadow
                    transition-all duration-400
                    hover:-translate-y-1
                  "
                >
                  <span className="relative z-10 group-hover:text-white duration-300">{label}</span>
                  <span
                    className="
                      absolute inset-0 bg-blue-700
                      translate-x-[-100%] group-hover:translate-x-0 
                      transition-transform duration-500
                    "
                  ></span>
                </a>
              ))}
            </div>
          </FadeInWrapper>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto mt-20 px-6 space-y-16">
        <FadeInWrapper>
          {teacher.education && (
            <Section id="education" title="Education" list={teacher.education} />
          )}
          {teacher.experience && (
            <Section id="experience" title="Experience" list={teacher.experience} />
          )}
          {teacher.researchActivities && (
            <Section id="researchActivities" title="Research Activities" list={teacher.researchActivities} />
          )}
          {teacher.publications && (
            <Section id="publications" title="Publications" list={teacher.publications} />
          )}
          {teacher.awards && <Section id="awards" title="Awards" list={teacher.awards} />}
          {teacher.membership && (
            <Section id="membership" title="Membership" list={teacher.membership} />
          )}

          {/* MAP */}
          <section id="office">
            <h2 className="text-3xl font-bold mb-5 text-blue-900">Office Location</h2>
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

// SECTION COMPONENT
function Section({ id, title, list }) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">{title}</h2>
      <ul className="list-disc ml-6 space-y-3 text-gray-700 text-[18px] leading-8">
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
