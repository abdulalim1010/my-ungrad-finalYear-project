import { clientPromise } from "@/lib/mongodb";

export async function GET() {
  try {
    // env check (VERY IMPORTANT)
    if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
      return new Response(
        JSON.stringify({ error: "Database env not configured" }),
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const events = await db
      .collection("events")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ serialize MongoDB data
    const safeEvents = events.map((item) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString?.() || null,
    }));

    return new Response(JSON.stringify(safeEvents), { status: 200 });
  } catch (error) {
    console.error("API /events error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch events" }),
      { status: 500 }
    );
  }
}
