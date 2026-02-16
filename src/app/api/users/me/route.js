import { clientPromise } from "@/lib/mongodb";

export async function GET(req) {
  try {
    // 🔐 Read email from headers
    const email = req.headers.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email header missing" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        email: user.email,
        role: user.role || "user", // 🔐 default user
        name: user.name,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ME API ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
