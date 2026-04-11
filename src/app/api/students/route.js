import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* =========================
   GET STUDENTS (Public)
   ========================= */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const { searchParams } = new URL(req.url);
    const session = searchParams.get("session");

    const query = session ? { session } : {};

    const students = await db
      .collection("students")
      .find(query)
      .sort({ createdAt: -1 }) // newest first
      .toArray();

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET students error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500 }
    );
  }
}

/* =========================
   POST STUDENT (Public)
   ========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    // Minimum required validation
    if (!body.name) {
      return new Response(
        JSON.stringify({ error: "Name is required" }),
        { status: 400 }
      );
    }

    // Validate studentId if provided (6-9 digits)
    if (body.studentId && (body.studentId.length < 6 || body.studentId.length > 9)) {
      return new Response(
        JSON.stringify({ error: "Student ID must be 6 to 9 digits" }),
        { status: 400 }
      );
    }

    // Validate registerNumber if provided (6-9 digits)
    if (body.registerNumber && (body.registerNumber.length < 6 || body.registerNumber.length > 9)) {
      return new Response(
        JSON.stringify({ error: "Register Number must be 6 to 9 digits" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    // Save all form fields dynamically
    const result = await db.collection("students").insertOne({
      ...body, // this will save everything from formData
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST student error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", message: err.message }),
      { status: 500 }
    );
  }
}

/* =========================
   DELETE STUDENT
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

    await db.collection("students").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE student error:", err);
    return NextResponse.json(
      { error: "Failed to delete student", message: err.message },
      { status: 500 }
    );
  }
}
