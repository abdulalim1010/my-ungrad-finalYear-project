import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const events = await db
      .collection("events")
      .find({})
      .sort({ date: 1 })
      .toArray();

    const safeEvents = events.map((item) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString?.() || null,
    }));

    return NextResponse.json(safeEvents);
  } catch (error) {
    console.error("API /events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const body = await request.json();

    const event = {
      title: body.title,
      description: body.description,
      date: body.date,
      time: body.time,
      location: body.location,
      createdAt: new Date(),
    };

    const result = await db.collection("events").insertOne(event);
    return NextResponse.json({ success: true, _id: result.insertedId.toString() });
  } catch (error) {
    console.error("API /events POST error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const body = await request.json();

    const { _id, ...updateData } = body;
    const ObjectId = (await import("mongodb")).ObjectId;

    await db.collection("events").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /events PUT error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 });
    }

    const ObjectId = (await import("mongodb")).ObjectId;
    await db.collection("events").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /events DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}