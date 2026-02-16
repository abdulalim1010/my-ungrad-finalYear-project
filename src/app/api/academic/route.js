import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/* ================= GET ================= */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = {};

  if (searchParams.get("type")) {
    query.type = searchParams.get("type");
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "department_portal");

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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- Prepare file ---------- */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name;
    const fileExtension = originalName.split(".").pop().toLowerCase();

    // clean filename (no space, no extension)
    const cleanName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    /* ---------- Upload to Cloudinary ---------- */
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "academic-files",
            resource_type: "raw", // PDF, DOCX, DOC → always raw
            public_id: `academic-${Date.now()}-${cleanName}`,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    /* ---------- Save to DB ---------- */
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    await db.collection("academic").insertOne({
      subject,
      type,
      year,
      semester,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: originalName,
      fileType: fileExtension,
      createdAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      message: "File uploaded successfully",
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed: " + err.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

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
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
