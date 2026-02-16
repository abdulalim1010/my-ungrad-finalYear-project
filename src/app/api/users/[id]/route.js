import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * PATCH → Update user role
 */
export async function PATCH(req, { params }) {
  try {
    // Next.js 16 compatible: params is a Promise
    const { id } = await params;
    const { role } = await req.json();

    if (!id || !role) {
      return Response.json(
        { error: "ID and role are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json(
      { error: error.message || "Failed to update role" },
      { status: 500 }
    );
  }
}

/**
 * DELETE → Remove user
 */
export async function DELETE(req, { params }) {
  try {
    // Next.js 16 compatible: params is a Promise
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "department_portal");

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
