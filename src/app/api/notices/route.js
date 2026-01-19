import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "departmentDB";

/* =========================
        GET (PUBLIC)
========================= */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const notices = await db
      .collection("notices")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(notices, {
      headers: {
        "Cache-Control": "no-store", // 🔥 VERY IMPORTANT
      },
    });
  } catch (error) {
    console.error("NOTICE GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load notices" },
      { status: 500 }
    );
  }
}

/* =========================
        POST (ADMIN)
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("notices").insertOne({
      title: body.title,
      description: body.description,
      fileUrl: body.fileUrl || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTICE POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}

/* =========================
        PUT (ADMIN)
========================= */
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.id || !ObjectId.isValid(body.id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("notices").updateOne(
      { _id: new ObjectId(body.id) },
      {
        $set: {
          title: body.title,
          description: body.description,
          fileUrl: body.fileUrl || null,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTICE PUT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update notice" },
      { status: 500 }
    );
  }
}

/* =========================
        DELETE (ADMIN)
========================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("notices").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTICE DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}
