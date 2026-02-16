import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const data = await db
      .collection("research_projects")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(data);
  } catch {
    return Response.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description, status } = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    await db.collection("research_projects").insertOne({
      title,
      description,
      status, // Ongoing | Completed
      createdAt: new Date(),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Insert failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    await db.collection("research_projects").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
