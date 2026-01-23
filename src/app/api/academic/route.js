import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

// ✅ build / vercel safe
export const dynamic = "force-dynamic";

/* =========================
        GET (FETCH FILES)
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {};

    if (searchParams.get("type")) query.type = searchParams.get("type");
    if (searchParams.get("year")) query.year = searchParams.get("year");
    if (searchParams.get("semester"))
      query.semester = searchParams.get("semester");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const files = await db
      .collection("academic")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("ACADEMIC GET ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/* =========================
        POST (UPLOAD)
   syllabus / notes / books / routine
========================= */
export async function POST(req) {
  try {
    const {
      title,
      subject,
      type, // syllabus | note | book | routine
      year,
      semester,
      fileBase64,
      fileName,
    } = await req.json();

    if (!title || !subject || !type || !fileBase64 || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 Upload original file (PDF / DOCX)
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      folder: "academic-files",
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const downloadUrl =
      uploadResult.secure_url +
      `?dl=1&filename=${encodeURIComponent(fileName)}`;

    await db.collection("academic").insertOne({
      title,
      subject,
      type,
      year: year || null,
      semester: semester || null,
      fileUrl: uploadResult.secure_url,
      downloadUrl,
      publicId: uploadResult.public_id,
      fileName,
      format: uploadResult.format,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { ok: true, message: "File uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("ACADEMIC POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

/* =========================
        DELETE (ALL TYPES)
========================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (file.publicId) {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: "raw",
      });
    }

    await db.collection("academic").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ ok: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("ACADEMIC DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
