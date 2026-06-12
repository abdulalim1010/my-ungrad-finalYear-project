import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

/* =========================
   GET PASSED STUDENTS
   ========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const query = status ? { status } : {};

    const students = await db
      .collection("passed_students")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(students);
  } catch (error) {
    console.error("GET passed students error:", error);
    return NextResponse.json(
      { message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

/* =========================
   POST (SUBMIT REQUEST)
   ========================= */
async function uploadPhotoToCloudinary(photo) {
  const buffer = Buffer.from(await photo.arrayBuffer());
  const mimeType = photo.type || "image/jpeg";

  return cloudinary.uploader.upload(
    `data:${mimeType};base64,${buffer.toString("base64")}`,
    {
      folder: "passed-students",
      resource_type: "image",
    }
  );
}

function hasServerCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      (process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
  );
}

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name;
    let session;
    let universityBatch;
    let departmentBatch;
    let company = "";
    let photoUrl = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      session = body.session;
      universityBatch = body.universityBatch;
      departmentBatch = body.departmentBatch;
      company = body.company || "";
      photoUrl = body.photoUrl;
    } else {
      const formData = await req.formData();
      name = formData.get("name");
      session = formData.get("session");
      universityBatch = formData.get("universityBatch");
      departmentBatch = formData.get("departmentBatch");
      company = formData.get("company") || "";
      photoUrl = formData.get("photoUrl") || "";

      const photo = formData.get("photo");

      if (!photoUrl && photo && typeof photo.arrayBuffer === "function") {
        const fileSizeMB = photo.size / (1024 * 1024);
        if (fileSizeMB > 2) {
          return NextResponse.json(
            { message: "Photo must be less than 2MB" },
            { status: 400 }
          );
        }

        if (!hasServerCloudinaryConfig()) {
          return NextResponse.json(
            {
              message:
                "Photo upload failed. Please refresh the page and try again.",
            },
            { status: 500 }
          );
        }

        const uploadResult = await uploadPhotoToCloudinary(photo);
        photoUrl = uploadResult.secure_url;
      }
    }

    if (!name || !session || !universityBatch || !departmentBatch || !photoUrl) {
      return NextResponse.json(
        {
          message:
            "Name, Session, University Batch, Department Batch and Photo are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    await db.collection("passed_students").insertOne({
      name,
      session,
      universityBatch,
      departmentBatch,
      company: company || "",
      photoUrl,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST passed student error:", error);
    return NextResponse.json(
      { message: error.message || "Submit failed" },
      { status: 500 }
    );
  }
}

/* =========================
   PATCH (APPROVE / REJECT)
   ========================= */
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    await db.collection("passed_students").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE (REMOVE STUDENT)
   ========================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    await db.collection("passed_students").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete passed student error:", error);
    return NextResponse.json(
      { message: "Failed to delete student" },
      { status: 500 }
    );
  }
}
