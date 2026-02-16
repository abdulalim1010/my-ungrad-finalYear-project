import { clientPromise } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Serialize MongoDB data
    const safeNews = news.map((item) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString?.() || new Date().toISOString(),
    }));

    return Response.json(safeNews);
  } catch (error) {
    console.error("API /news error:", error);
    return Response.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
