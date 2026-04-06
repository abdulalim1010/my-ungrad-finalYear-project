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
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { subject, type, year, semester, linkUrl, fileType } = body;

      if (!subject || !type || !year || !semester) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      if (!linkUrl) {
        return NextResponse.json({ error: "Link URL is required" }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "department_portal");

      await db.collection("academic").insertOne({
        subject,
        type,
        year,
        semester,
        linkUrl,
        fileType: "link",
        createdAt: new Date(),
      });

      return NextResponse.json({ ok: true, message: "Link added successfully" });
    }

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

    const allowedExtensions = ["pdf", "docx", "doc"];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Only PDF or DOCX files are allowed" },
        { status: 400 }
      );
    }

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
            resource_type: "auto",
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
    const { id, adminEmail } = await req.json();

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const adminUser = await db.collection("users").findOne({ email: adminEmail });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(id) });

    if (file?.publicId) {
      const resourceType = file.fileType === "link" ? "raw" : (file.fileType === "pdf" || file.fileType === "doc" || file.fileType === "docx" ? "raw" : "image");
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: resourceType,
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
