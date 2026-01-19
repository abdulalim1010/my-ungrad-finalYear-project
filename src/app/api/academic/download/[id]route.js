import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const file = await db
      .collection("academic")
      .findOne({ _id: new ObjectId(params.id) });

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    // 🔥 Fetch file from Cloudinary
    const cloudRes = await fetch(file.fileUrl);
    const buffer = await cloudRes.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return new Response("Download failed", { status: 500 });
  }
}
