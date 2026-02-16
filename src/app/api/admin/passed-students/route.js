import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

/* =========================
   POST - Admin Add Passed Student
   ========================= */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const batch = formData.get("batch");
    const designation = formData.get("designation");
    const company = formData.get("company");
    const linkedin = formData.get("linkedin");
    const image = formData.get("image");

    if (!name || !batch || !image) {
      return NextResponse.json(
        { message: "Name, batch, and image are required" },
        { status: 400 }
      );
    }

    // Upload image to cloudinary
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "passed-students" }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    await db.collection("passed_students").insertOne({
      name,
      batch,
      designation: designation || "",
      company: company || "",
      linkedin: linkedin || "",
      photoUrl: uploadResult.secure_url,
      status: "approved", // Admin directly adds as approved
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin add passed student error:", error);
    return NextResponse.json(
      { message: "Failed to add student" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE - Admin Delete Passed Student
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
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const result = await db.collection("passed_students").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete passed student error:", error);
    return NextResponse.json(
      { message: "Failed to delete student" },
      { status: 500 }
    );
  }
}
