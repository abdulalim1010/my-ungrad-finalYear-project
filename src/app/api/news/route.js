import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const safeNews = news.map((item) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString?.() || new Date().toISOString(),
    }));

    return NextResponse.json(safeNews);
  } catch (error) {
    console.error("API /news error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const body = await request.json();

    const newsItem = {
      title: body.title,
      description: body.description,
      image: body.image,
      category: body.category,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      views: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("news").insertOne(newsItem);
    return NextResponse.json({ success: true, _id: result.insertedId.toString() });
  } catch (error) {
    console.error("API /news POST error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const body = await request.json();

    const { _id, ...updateData } = body;

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    await db.collection("news").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /news PUT error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "News ID required" }, { status: 400 });
    }

    await db.collection("news").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /news DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}