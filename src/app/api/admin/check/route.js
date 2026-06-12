import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// 🔥 MUST — build / vercel safe
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { role: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { role: null, error: "Invalid token" },
        { status: 401 }
      );
    }

    // 🔥 ENV SAFETY (Vercel build crash prevent)
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI missing");
      return NextResponse.json(
        { role: null, error: "Server config error" },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json(
        { role: null, error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ SAFE RETURN
    return NextResponse.json(
      { role: user.role ?? null },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /admin/check error:", err);
    return NextResponse.json(
      { role: null, error: "Server error" },
      { status: 500 }
    );
  }
}
