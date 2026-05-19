import { clientPromise } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic"; // 🔥 VERY IMPORTANT

// ================= GET SINGLE FILE =================
export async function GET(req, { params }) {
  try {
    const { id } = params; // ❌ no await

    if (!id || !ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return Response.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return Response.json(file);
  } catch (error) {
    console.error("GET /api/academic/[id] ERROR:", error);
    return Response.json(
      { error: "Failed to fetch academic file" },
      { status: 500 }
    );
  }
}

// ================= DELETE FILE =================
export async function DELETE(req, { params }) {
  try {
    const { id } = params; // ❌ no await

    if (!id || !ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(id) });

    if (!file) {
      return Response.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // 🔥 Delete from Cloudinary
    if (file.publicId) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: "raw",
        });
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

    // 🔥 Delete from MongoDB
    await db.collection("academic").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
      message: "Academic file deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/academic/[id] ERROR:", error);
    return Response.json(
      { error: "Failed to delete academic file" },
      { status: 500 }
    );
  }
}
