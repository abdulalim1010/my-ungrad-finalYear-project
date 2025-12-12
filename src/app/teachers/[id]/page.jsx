import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";

export default async function TeacherDetail(props) {
  const { id } = await props.params;

  const client = await clientPromise;
  const db = client.db("departmentDB");

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

      {/* BACK */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <Link href="/teachers" className="text-blue-700 font-semibold">
          ← Back
        </Link>
      </div>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 mt-10">

        <div className="flex flex-col lg:flex-row gap-14">

          {/* IMAGE */}
          <img
            src={teacher.image}
            className="w-full lg:w-1/3 h-[450px] object-cover rounded-xl"
          />

          {/* DETAILS */}
          <div className="flex-1">

            <h1 className="text-5xl font-extrabold text-blue-900">{teacher.name}</h1>
            <p className="text-2xl text-gray-600 mt-1">{teacher.designation}</p>

            {/* CONTACT */}
            <div className="mt-8 space-y-2 text-lg text-gray-700">
              <p><strong>Department:</strong> {teacher.department}</p>
              <p><strong>Email:</strong> {teacher.email}</p>
              <p><strong>Phone:</strong> {teacher.phone}</p>
            </div>

            {/* BIO */}
            <p className="mt-8 text-gray-800 text-[18px] leading-8">
              {teacher.bio}
            </p>

            {/* SMALL HEIGHT BUTTONS */}
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
                    transition-all duration-400
                    hover:-translate-y-1
                  "
                >
                  <span className="relative z-10 group-hover:text-white duration-300">
                    {label}
                  </span>

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

          </div>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto mt-20 px-6 space-y-16">

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

      </div>
    </div>
  );
}

/* SECTION COMPONENT */
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
