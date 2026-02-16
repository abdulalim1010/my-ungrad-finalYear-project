import { clientPromise } from "@/lib/mongodb";

/* =========================
   GET STUDENTS (Public)
   ========================= */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const students = await db
      .collection("students")
      .find({})
      .sort({ createdAt: -1 }) // newest first
      .toArray();

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET students error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500 }
    );
  }
}

/* =========================
   POST STUDENT (Public)
   ========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    // Minimum required validation
    if (!body.name || !body.studentId) {
      return new Response(
        JSON.stringify({ error: "Name and Student ID are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    // Save all form fields dynamically
    const result = await db.collection("students").insertOne({
      ...body, // this will save everything from formData
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST student error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500 }
    );
  }
}
