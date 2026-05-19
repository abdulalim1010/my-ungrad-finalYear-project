import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "departmentDB");
  const data = await db.collection("research_areas").find().toArray();
  return Response.json(data);
}

export async function POST(req) {
  const { title, description } = await req.json();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "departmentDB");

  await db.collection("research_areas").insertOne({
    title,
    description,
    createdAt: new Date(),
  });

  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "departmentDB");

  await db.collection("research_areas").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json({ ok: true });
}
