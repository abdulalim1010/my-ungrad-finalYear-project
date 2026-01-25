import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/* ================= GET ================= */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = {};

  if (searchParams.get("type")) query.type = searchParams.get("type");

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const files = await db
    .collection("academic")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(files);
}

/* ================= POST ================= */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const subject = formData.get("subject");
    const type = formData.get("type");
    const year = formData.get("year");
    const semester = formData.get("semester");

    if (!file || !subject || !type) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "academic-files",
          resource_type: "raw", // ✅ pdf/docx
          use_filename: true,
          unique_filename: false,
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      ).end(buffer);
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const downloadUrl =
      uploadResult.secure_url +
      `?dl=1&filename=${encodeURIComponent(file.name)}`;

    await db.collection("academic").insertOne({
      subject,
      type,
      year,
      semester,
      fileUrl: uploadResult.secure_url,
      downloadUrl,
      publicId: uploadResult.public_id,
      fileName: file.name,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const file = await db
    .collection("academic")
    .findOne({ _id: new ObjectId(id) });

  if (file?.publicId) {
    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: "raw",
    });
  }

  await db.collection("academic").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ ok: true });
}
