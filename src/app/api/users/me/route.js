import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401 }
      );
    }

    const { clientPromise } = await import("@/lib/mongodb");
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        email: user.email,
        role: user.role || "user",
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
