import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// 🔥 MUST — build / vercel safe
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // 🔥 ENV SAFETY (Vercel build crash prevent)
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI missing");
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ SAFE RETURN
    return NextResponse.json(
      {
        name: user.name || "Admin",
        email: user.email,
        role: user.role || "admin",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN ME ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}