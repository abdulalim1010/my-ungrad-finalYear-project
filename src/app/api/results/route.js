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

    const results = await db.collection("results")
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();

    const safeResults = results.map((item) => ({
      ...item,
      _id: item._id.toString(),
      uploadedAt: item.uploadedAt?.toISOString?.() || null,
    }));

    return NextResponse.json(safeResults);
  } catch (err) {
    console.error("GET results error:", err);
    return NextResponse.json(
      { error: "Fetch failed: " + err.message },
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
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop().toLowerCase();

    const uploadResult = await cloudinary.uploader.upload(
      `data:${file.type};base64,${fileBuffer.toString("base64")}`,
      {
        folder: "results",
        resource_type: fileExtension === "pdf" || fileExtension === "doc" || fileExtension === "docx" ? "raw" : "auto",
      }
    );

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
