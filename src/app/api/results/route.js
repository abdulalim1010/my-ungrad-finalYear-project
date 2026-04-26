import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/* ================= GET ================= */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const { searchParams } = new URL(req.url);
    const session = searchParams.get("session");

    const query = session ? { session } : {};

    const results = await db
      .collection("results")
      .find(query)
      .sort({ uploadedAt: -1 })
      .toArray();

    return NextResponse.json(results);
  } catch (err) {
    console.error("GET results error:", err);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const session = formData.get("session");
    const year = formData.get("year");
    const file = formData.get("file");

    if (!title || !session || !year || !file) {
      return NextResponse.json(
        { error: "Title, session, year, and file are required" },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx"];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, or DOCX files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

     const uploadResult = await new Promise((resolve, reject) => {
       cloudinary.uploader
         .upload_stream(
           {
             folder: "results",
             resource_type: "raw",
             public_id: `result-${Date.now()}-${cleanName}`,
           },
           (err, result) => {
             if (err) reject(err);
             else resolve(result);
           }
         )
         .end(buffer);
     });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    await db.collection("results").insertOne({
      title,
      session,
      year,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: file.name,
      fileType: fileExtension,
      fileSize: file.size,
      uploadedAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      message: "Result document uploaded successfully",
    });
  } catch (err) {
    console.error("POST results error:", err);
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

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const resultDoc = await db
      .collection("results")
      .findOne({ _id: new ObjectId(id) });

    if (resultDoc?.publicId) {
      const resourceType =
        resultDoc.fileType === "pdf" || resultDoc.fileType === "doc" || resultDoc.fileType === "docx"
          ? "raw"
          : "auto";
      await cloudinary.uploader.destroy(resultDoc.publicId, {
        resource_type: resourceType,
      });
    }

    await db.collection("results").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE results error:", err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
