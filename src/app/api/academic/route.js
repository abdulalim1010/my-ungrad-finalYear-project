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
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop().toLowerCase();

    // Determine resource type based on file type
    let resourceType = "raw";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileExtension)) {
      resourceType = "image";
    } else if (["pdf"].includes(fileExtension)) {
      resourceType = "raw";
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: "academic-files",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        // Preserve original format
        format: fileExtension,
        // Add public_id with original name structure
        public_id: `academic-${Date.now()}-${originalFilename.replace(/\.[^/.]+$/, "")}`,
      };

      cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
        if (err) reject(err);
        resolve(result);
      }).end(buffer);
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Create proper download URL that preserves the file
    // For Cloudinary raw files, we use the upload result URL directly
    let downloadUrl = uploadResult.secure_url;
    
    // If it's a raw file (PDF), ensure proper download behavior
    if (resourceType === "raw") {
      // Add download flag and original filename
      downloadUrl = `${uploadResult.secure_url}?fl_attachment=${encodeURIComponent(originalFilename)}`;
    }

    await db.collection("academic").insertOne({
      subject,
      type,
      year,
      semester,
      fileUrl: uploadResult.secure_url,
      downloadUrl,
      publicId: uploadResult.public_id,
      fileName: originalFilename,
      fileType: fileExtension,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      ok: true, 
      message: "File uploaded successfully",
      fileName: originalFilename 
    });
  } catch (err) {
    console.error("Academic file upload error:", err);
    return NextResponse.json(
      { error: "Upload failed: " + err.message },
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
    // Determine resource type for deletion
    let resourceType = "raw";
    if (file.fileType && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(file.fileType)) {
      resourceType = "image";
    }

    try {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: resourceType,
      });
    } catch (deleteErr) {
      console.error("Cloudinary delete error:", deleteErr);
    }
  }

  await db.collection("academic").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ ok: true });
}
