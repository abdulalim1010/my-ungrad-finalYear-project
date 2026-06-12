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
      const session = formData.get("session");
      const universityBatch = formData.get("universityBatch");
      const departmentBatch = formData.get("departmentBatch");
      const company = formData.get("company");
      const linkedin = formData.get("linkedin");
      const image = formData.get("image");

      if (!name || !session || !universityBatch || !departmentBatch || !image) {
        return NextResponse.json(
          { message: "Name, Session, University Batch, Department Batch, and image are required" },
          { status: 400 }
        );
      }

      if (typeof image.arrayBuffer !== "function") {
        return NextResponse.json(
          { message: "Invalid image file" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const mimeType = image.type || "image/jpeg";

      const uploadResult = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${buffer.toString("base64")}`,
        {
          folder: "passed-students",
          resource_type: "image",
        }
      );

      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "departmentDB");

    await db.collection("passed_students").insertOne({
      name,
      session,
      universityBatch,
      departmentBatch,
      company: company || "",
      linkedin: linkedin || "",
      photoUrl: uploadResult.secure_url,
      status: "approved",
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
      const db = client.db(process.env.MONGODB_DB || "departmentDB");

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
