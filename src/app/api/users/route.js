import { clientPromise } from "@/lib/mongodb";

/**
 * POST: Register user in MongoDB
 */
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, firebaseUid } = data;

    if (!name || !email || !firebaseUid) {
      return new Response(
        JSON.stringify({ error: "Name, Email and Firebase UID are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    // Check existing user
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "User already exists",
          role: existingUser.role,
        }),
        { status: 200 }
      );
    }

    // 🔐 Admin emails
    const ADMIN_EMAILS = [
      "admin@mydepartment.edu",
      "chairman@mydepartment.edu",
    ];

    // ✅ FINAL ROLE LOGIC
    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

    const result = await db.collection("users").insertOne({
      name,
      email,
      firebaseUid,
      role, // user | admin
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        insertedId: result.insertedId,
        role,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("User save error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save user" }),
      { status: 500 }
    );
  }
}

/**
 * GET: Get all users (admin dashboard)
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const users = await db.collection("users").find().toArray();

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}
