import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";

// 🔥 MUST — build / vercel safe
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { role: null, error: "Email missing" },
        { status: 400 }
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

    const user = await db.collection("users").findOne({ email });

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
