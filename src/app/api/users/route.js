import { clientPromise } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const ADMIN_EMAILS = [
  "admin@mydepartment.edu",
  "chairman@mydepartment.edu",
];

/**
 * POST: Register user in MongoDB
 */
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, Email and Password are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      firebaseUid: null,
      role,
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
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const users = await db.collection("users").find().toArray();

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}
