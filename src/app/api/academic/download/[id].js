// app/api/academic/download/[id]/route.js
import clientPromise from "@/lib/mongodb";
import fetch from "node-fetch"; // Needed to fetch Cloudinary file
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new Response("ID is required", { status: 400 });

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const file = await db.collection("academic").findOne({ _id: new ObjectId(id) });
    if (!file) return new Response("File not found", { status: 404 });

    // Fetch the file from Cloudinary
    const cloudinaryRes = await fetch(file.fileUrl);
    if (!cloudinaryRes.ok) return new Response("Failed to fetch file", { status: 500 });

    const blob = await cloudinaryRes.arrayBuffer();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return new Response("Download failed", { status: 500 });
  }
}
