import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/gallery");
  revalidatePath("/");

  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  const item = await db.collection("student_gallery").findOne({ _id: new ObjectId(id) });

  if (item?.publicId) {
    try {
      await cloudinary.uploader.destroy(item.publicId);
    } catch (err) {
      console.error("Cloudinary delete error:", err);
    }
  }

  await db.collection("student_gallery").deleteOne({
    _id: new ObjectId(id),
  });

  revalidatePath("/gallery");
  revalidatePath("/");

  return Response.json({ ok: true });
}
