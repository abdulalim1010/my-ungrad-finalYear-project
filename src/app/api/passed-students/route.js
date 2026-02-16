import { NextResponse } from "next/server";
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
    const db = client.db("departmentDB");

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
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const batch = formData.get("batch");
    const designation = formData.get("designation");
    const company = formData.get("company");
    const photo = formData.get("photo");

    if (!name || !batch || !photo) {
      return NextResponse.json(
        { message: "Name, Batch and Photo are required" },
        { status: 400 }
      );
    }

    /* ==== Upload to Cloudinary ==== */
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "passed-students" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const client = await clientPromise;
    const db = client.db("departmentDB");

    await db.collection("passed_students").insertOne({
      name,
      batch,
      designation: designation || "",
      company: company || "",
      photoUrl: uploadResult.secure_url,
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
      { message: "Submit failed" },
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
    const db = client.db("departmentDB");

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
    const db = client.db("departmentDB");

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
