import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/* ================= GET ================= */
export async function GET(req) {
  try {
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
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

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
