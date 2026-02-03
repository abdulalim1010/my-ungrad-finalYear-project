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

    // Strip the fl_attachment parameter when fetching from Cloudinary
    const cloudinaryUrl = file.fileUrl.split("?")[0];
    
    // Fetch file from Cloudinary
    const cloudRes = await fetch(cloudinaryUrl, {
      headers: {
        // Add authentication if needed
        "Accept": "application/octet-stream",
      },
    });

    if (!cloudRes.ok) {
      console.error("Cloudinary fetch error:", cloudRes.status, cloudRes.statusText);
      return new Response("Failed to fetch file from storage", { status: cloudRes.status });
    }

    const buffer = await cloudRes.arrayBuffer();
    
    // Determine content type
    const contentType = file.fileType === "pdf" 
      ? "application/pdf" 
      : "application/octet-stream";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return new Response("Download failed: " + err.message, { status: 500 });
  }
}
