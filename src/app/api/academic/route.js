import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

/* =========================
        GET (Fetch files)
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {};

    if (searchParams.get("type")) query.type = searchParams.get("type");
    if (searchParams.get("year")) query.year = searchParams.get("year");
    if (searchParams.get("semester")) query.semester = searchParams.get("semester");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const files = await db
      .collection("academic")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(files);
  } catch (error) {
    console.error("ACADEMIC GET ERROR:", error);
    return Response.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

/* =========================
        POST (UPLOAD)
========================= */
export async function POST(req) {
  try {
    const {
      title,
      subject,
      type,
      year,
      semester,
      fileBase64,
      fileName,
    } = await req.json();

    if (!title || !subject || !type || !year || !semester || !fileBase64) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🔥 Upload to Cloudinary as RAW (original format)
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      folder: "academic-files",
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    // ✅ Original file download link
    const downloadUrl =
      uploadResult.secure_url +
      `?dl=1&filename=${encodeURIComponent(fileName)}`;

    await db.collection("academic").insertOne({
      title,
      subject,
      type,
      year,
      semester,
      fileUrl: uploadResult.secure_url,
      downloadUrl,
      publicId: uploadResult.public_id,
      fileName,
      format: uploadResult.format,
      createdAt: new Date(),
    });

    return Response.json(
      { ok: true, message: "File uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("ACADEMIC POST ERROR:", error);
    return Response.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

/* =========================
        DELETE
========================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ error: "ID required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    if (file.publicId) {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: "raw",
      });
    }

    await db.collection("academic").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ ok: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("ACADEMIC DELETE ERROR:", error);
    return Response.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
