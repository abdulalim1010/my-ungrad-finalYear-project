import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  const data = await req.formData();
  const image = data.get("image");

  const buffer = Buffer.from(await image.arrayBuffer());
  const upload = await cloudinary.uploader.upload(
    `data:image/png;base64,${buffer.toString("base64")}`,
    { folder: "student-gallery" }
  );

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

  await db.collection("student_gallery").insertOne({
    title: data.get("title"),
    description: data.get("description"),
    studentName: data.get("studentName"),
    imageUrl: upload.secure_url,
    status: "pending",
    createdAt: new Date(),
  });

  return Response.json({ ok: true });
}
