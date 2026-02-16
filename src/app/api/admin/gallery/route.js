import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  const data = await db
    .collection("student_gallery")
    .find(status ? { status } : {})
    .toArray();

  return Response.json(data);
}

export async function PATCH(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  await db.collection("student_gallery").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "approved" } }
  );

  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  await db.collection("student_gallery").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json({ ok: true });
}
